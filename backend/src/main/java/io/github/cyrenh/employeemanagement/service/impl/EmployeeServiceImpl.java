package io.github.cyrenh.employeemanagement.service.impl;

import io.github.cyrenh.employeemanagement.domain.Employee;
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

        byte[] photoBytes = null;
        String photoContentType = null;
        if (photo != null && !photo.isEmpty()) {
            photoBytes = readBytes(photo);
            photoContentType = ImageValidator.detectContentType(photoBytes);
        }

        Employee employee = mapper.toDomain(UUID.randomUUID(), request, photoBytes, photoContentType);

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
        if (employee.getPhoto() == null) {
            throw new NotFoundException("Employee has no photo");
        }
        return new PhotoResponse(employee.getPhoto(), employee.getPhotoContentType());
    }

}