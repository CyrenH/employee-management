package io.github.cyrenh.employeemanagement.dto;

import io.github.cyrenh.employeemanagement.domain.Department;
import jakarta.validation.constraints.*;

public record EmployeeRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @NotNull(message = "Department is required")
        Department department,

        boolean active,

        @NotBlank(message = "Number is required")
        @Pattern(regexp = "^\\+?[0-9\\s-]{7,15}$", message = "Enter a valid phone number")
        String number,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        @Size(max = 254, message = "Email is too long")
        String email,

        @NotBlank(message = "Address is required")
        @Size(max = 255, message = "Address must be at most 255 characters")
        String address

) { }