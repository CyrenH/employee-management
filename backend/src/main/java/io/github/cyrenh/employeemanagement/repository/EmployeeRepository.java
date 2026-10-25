package io.github.cyrenh.employeemanagement.repository;

import io.github.cyrenh.employeemanagement.domain.Employee;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository {
    Employee save(Employee employee);
    boolean existsByEmail(String email);
    List<Employee> findAll();
    Optional<Employee> findById(UUID id);
}