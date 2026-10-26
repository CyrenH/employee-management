package io.github.cyrenh.employeemanagement.dto;

public record PhotoResponse(byte[] bytes, String contentType, String version) { }