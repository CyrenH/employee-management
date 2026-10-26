package io.github.cyrenh.employeemanagement.service.impl;

import io.github.cyrenh.employeemanagement.domain.Employee;
import io.github.cyrenh.employeemanagement.domain.Photo;
import io.github.cyrenh.employeemanagement.dto.EmployeeRequest;
import io.github.cyrenh.employeemanagement.dto.EmployeeResponse;
import io.github.cyrenh.employeemanagement.dto.PhotoResponse;
import io.github.cyrenh.employeemanagement.exception.DuplicateEmailException;
import io.github.cyrenh.employeemanagement.exception.InvalidImageException;
import io.github.cyrenh.employeemanagement.exception.NotFoundException;
import io.github.cyrenh.employeemanagement.mapper.EmployeeMapper;
import io.github.cyrenh.employeemanagement.repository.EmployeeRepository;
import io.github.cyrenh.employeemanagement.service.EmployeeService;
import io.github.cyrenh.employeemanagement.util.ImageValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository repository;
    private final EmployeeMapper mapper;

    // Makes "check email, then save" atomic; the repository alone can't guarantee that
    private final Object writeLock = new Object();

    @Override
    public EmployeeResponse create(EmployeeRequest request, MultipartFile photo) {

        Photo uploaded = readUploadedPhoto(photo); // validated before locking

        Employee employee = mapper.toDomain(UUID.randomUUID(), request, uploaded);

        synchronized (writeLock) {
            if (repository.existsByEmail(employee.getEmail())) {
                throw new DuplicateEmailException(employee.getEmail());
            }
            repository.save(employee);
        }

        log.debug("Created employee {}", employee.getId());
        return mapper.toResponse(employee);
    }

    private byte[] readBytes(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new InvalidImageException("Could not read the uploaded photo");
        }
    }

    @Override
    public List<EmployeeResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    public PhotoResponse getPhoto(UUID id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee not found"));
        Photo photo = employee.getPhoto();
        if (photo == null) {
            throw new NotFoundException("Employee has no photo");
        }
        return new PhotoResponse(photo.bytes(), photo.contentType(), photo.version());
    }

    @Override
    public EmployeeResponse findById(UUID id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Employee not found"));
    }

    @Override
    public EmployeeResponse update(UUID id, EmployeeRequest request, MultipartFile photo, boolean removePhoto) {

        Photo uploaded = readUploadedPhoto(photo);   // validated before locking

        Employee updated;

        synchronized (writeLock) {
            Employee existing = repository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Employee not found"));

            // A new photo replaces the old one; otherwise keep it, unless the user asked to remove it
            Photo newPhoto = existing.getPhoto();
            if (uploaded != null) {
                newPhoto = uploaded;
            } else if (removePhoto) {
                newPhoto = null;
            }

            updated = mapper.applyUpdate(existing, request, newPhoto);

            // The employee's own current email is allowed; only other employees' emails conflict
            if (repository.existsByEmailAndIdNot(updated.getEmail(), id)) {
                throw new DuplicateEmailException(updated.getEmail());
            }
            repository.save(updated);
        }

        log.debug("Updated employee {}", id);
        return mapper.toResponse(updated);
    }

    /** Reads and validates an uploaded file; returns null when no file was sent. */
    private Photo readUploadedPhoto(MultipartFile photo) {
        if (photo == null || photo.isEmpty()) {
            return null;
        }
        byte[] bytes = readBytes(photo);
        // The version is a fingerprint of the image, computed once here instead of on every request
        return new Photo(bytes, ImageValidator.detectContentType(bytes), DigestUtils.md5DigestAsHex(bytes));
    }

}