package io.github.cyrenh.employeemanagement.repository;

import io.github.cyrenh.employeemanagement.domain.Employee;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryEmployeeRepository implements EmployeeRepository {

    // ConcurrentHashMap has no defined order, so findAll sorts for a stable list
    private static final Comparator<Employee> BY_NAME = Comparator
            .comparing(Employee::getName, String.CASE_INSENSITIVE_ORDER)
            .thenComparing(Employee::getEmail, String.CASE_INSENSITIVE_ORDER);

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

    @Override
    public List<Employee> findAll() {
        return store.values().stream().sorted(BY_NAME).toList();
    }

    @Override
    public Optional<Employee> findById(UUID id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public boolean existsByEmailAndIdNot(String email, UUID id) {
        return store.values().stream()
                .anyMatch(e -> !e.getId().equals(id) && e.getEmail().equalsIgnoreCase(email));
    }

}