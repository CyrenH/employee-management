package io.github.cyrenh.employeemanagement.dto;

import io.github.cyrenh.employeemanagement.domain.Department;

import java.util.UUID;

public record EmployeeResponse(
        UUID id,
        String name,
        Department department,
        boolean active,
        String number,
        String email,
        String address,
        boolean hasPhoto
) { }