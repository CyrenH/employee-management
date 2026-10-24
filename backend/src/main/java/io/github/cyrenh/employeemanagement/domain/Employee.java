package io.github.cyrenh.employeemanagement.domain;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

/**
 * Immutable domain object held in memory. There is no database.
 * Final fields make it safe to share across request threads; updates build a modified
 * copy and replace the stored one instead of mutating it.
 */
@Getter
@Builder
public class Employee {
    private final UUID id;
    private final String name;
    private final Department department;
    private final boolean active;
    private final String number;
    private final String email;
    private final String address;
    private final byte[] photo;
    private final String photoContentType;
}