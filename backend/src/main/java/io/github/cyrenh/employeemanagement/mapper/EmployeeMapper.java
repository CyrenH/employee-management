package io.github.cyrenh.employeemanagement.mapper;

import io.github.cyrenh.employeemanagement.domain.Employee;
import io.github.cyrenh.employeemanagement.dto.EmployeeRequest;
import io.github.cyrenh.employeemanagement.dto.EmployeeResponse;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class EmployeeMapper {

    public Employee toDomain(UUID id, EmployeeRequest request, byte[] photo, String photoContentType) {
        return Employee.builder()
                .id(id)
                .name(request.name().trim())
                .department(request.department())
                .active(request.active())
                .number(request.number().trim())
                .email(request.email().trim())
                .address(request.address().trim())
                .photo(photo)
                .photoContentType(photoContentType)
                .build();
    }

    public EmployeeResponse toResponse(Employee e) {
        return new EmployeeResponse(e.getId(), e.getName(), e.getDepartment(), e.isActive(),
                e.getNumber(), e.getEmail(), e.getAddress(), e.getPhoto() != null);
    }

}