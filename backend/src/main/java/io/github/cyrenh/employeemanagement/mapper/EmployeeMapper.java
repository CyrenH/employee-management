package io.github.cyrenh.employeemanagement.mapper;

import io.github.cyrenh.employeemanagement.domain.Employee;
import io.github.cyrenh.employeemanagement.domain.Photo;
import io.github.cyrenh.employeemanagement.dto.EmployeeRequest;
import io.github.cyrenh.employeemanagement.dto.EmployeeResponse;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class EmployeeMapper {

    public Employee toDomain(UUID id, EmployeeRequest request, Photo photo) {
        return Employee.builder()
                .id(id)
                .name(request.name().trim())
                .department(request.department())
                .active(request.active())
                .number(request.number().trim())
                .email(request.email().trim())
                .address(request.address().trim())
                .photo(photo)
                .build();
    }

    /** Builds the updated copy: same id, new field values, and the photo the service decided on. */
    public Employee applyUpdate(Employee existing, EmployeeRequest request, Photo photo) {
        return existing.toBuilder()
                .name(request.name().trim())
                .department(request.department())
                .active(request.active())
                .number(request.number().trim())
                .email(request.email().trim())
                .address(request.address().trim())
                .photo(photo)
                .build();
    }

    public EmployeeResponse toResponse(Employee e) {
        String photoVersion = e.getPhoto() == null ? null : e.getPhoto().version();
        return new EmployeeResponse(e.getId(), e.getName(), e.getDepartment(), e.isActive(),
                e.getNumber(), e.getEmail(), e.getAddress(), photoVersion);
    }

}