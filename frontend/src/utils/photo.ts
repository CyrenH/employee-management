export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // matches spring.servlet.multipart.max-file-size

/** Returns an error message, or null when the file is acceptable. */
export const validatePhoto = (file: File): string | null => {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
        return "Only JPEG, PNG or WebP images are allowed";
    }
    if (file.size > MAX_PHOTO_BYTES) {
        return "Photo must be under 2 MB";
    }
    return null;
};