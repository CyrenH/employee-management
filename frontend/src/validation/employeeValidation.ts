import type { Department } from "../types/employee";

const PHONE_PATTERN = /^\+?[0-9\s-]{7,15}$/;
const EMAIL_PATTERN = /^\S+@\S+$/; // light check; the server applies the full email validation

export const employeeValidators = {
    name: (value: string) => {
        const v = value.trim();
        if (!v) return "Name is required";
        return v.length > 100 ? "Name must be at most 100 characters" : null;
    },
    department: (value: Department | null) => (value ? null : "Select a department"),
    number: (value: string) => {
        const v = value.trim();
        if (!v) return "Number is required";
        return PHONE_PATTERN.test(v) ? null : "Enter a valid phone number";
    },
    email: (value: string) => {
        const v = value.trim();
        if (!v) return "Email is required";
        if (v.length > 254) return "Email is too long";
        return EMAIL_PATTERN.test(v) ? null : "Enter a valid email address";
    },
    address: (value: string) => {
        const v = value.trim();
        if (!v) return "Address is required";
        return v.length > 255 ? "Address must be at most 255 characters" : null;
    },
};