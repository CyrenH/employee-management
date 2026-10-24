package io.github.cyrenh.employeemanagement.util;

import io.github.cyrenh.employeemanagement.exception.InvalidImageException;

public final class ImageValidator {

    private ImageValidator() {}

    public static String detectContentType(byte[] bytes) {
        if (startsWith(bytes, 0, 0xFF, 0xD8, 0xFF)) return "image/jpeg";
        if (startsWith(bytes, 0, 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)) return "image/png";
        if (startsWith(bytes, 0, 0x52, 0x49, 0x46, 0x46)
                && startsWith(bytes, 8, 0x57, 0x45, 0x42, 0x50)) return "image/webp";
        throw new InvalidImageException("Only JPEG, PNG or WebP images are allowed");
    }

    private static boolean startsWith(byte[] bytes, int offset, int... expected) {
        if (bytes.length < offset + expected.length) return false;
        for (int i = 0; i < expected.length; i++) {
            if ((bytes[offset + i] & 0xFF) != expected[i]) return false;
        }
        return true;
    }

}