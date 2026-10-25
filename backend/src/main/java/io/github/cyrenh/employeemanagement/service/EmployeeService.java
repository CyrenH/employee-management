package io.github.cyrenh.employeemanagement.service;

import io.github.cyrenh.employeemanagement.dto.EmployeeRequest;
import io.github.cyrenh.employeemanagement.dto.EmployeeResponse;
import io.github.cyrenh.employeemanagement.dto.PhotoResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface EmployeeService {
    EmployeeResponse create(EmployeeRequest request, MultipartFile photo);
    List<EmployeeResponse> findAll();
    PhotoResponse getPhoto(UUID id);
}