package io.github.cyrenh.employeemanagement.repository;

import io.github.cyrenh.employeemanagement.domain.Employee;

public interface EmployeeRepository {
    Employee save(Employee employee);
    boolean existsByEmail(String email);
}