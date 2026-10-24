package io.github.cyrenh.employeemanagement.repository;

import io.github.cyrenh.employeemanagement.domain.Employee;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryEmployeeRepository implements EmployeeRepository {

    // ConcurrentHashMap: requests are handled on multiple threads
    private final Map<UUID, Employee> store = new ConcurrentHashMap<>();

    @Override
    public Employee save(Employee employee) {
        store.put(employee.getId(), employee);
        return employee;
    }

    @Override
    public boolean existsByEmail(String email) {
        return store.values().stream()
                .anyMatch(e -> e.getEmail().equalsIgnoreCase(email));
    }

}