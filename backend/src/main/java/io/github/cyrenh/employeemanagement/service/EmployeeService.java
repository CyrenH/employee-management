package io.github.cyrenh.employeemanagement.service;

import io.github.cyrenh.employeemanagement.dto.EmployeeRequest;
import io.github.cyrenh.employeemanagement.dto.EmployeeResponse;
import org.springframework.web.multipart.MultipartFile;

public interface EmployeeService {
    EmployeeResponse create(EmployeeRequest request, MultipartFile photo);
}