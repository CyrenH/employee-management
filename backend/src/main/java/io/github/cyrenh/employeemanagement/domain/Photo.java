package io.github.cyrenh.employeemanagement.domain;

/**
 * An uploaded photo. The content type is detected from the bytes, and the version is a fingerprint
 * of them: it changes whenever the image changes, so URLs and ETags built from it identify one exact image.
 */
public record Photo(byte[] bytes, String contentType, String version) { }