import type { Department } from "../types/employee";

// 7 to 15 digits in total (E.164 maximum), with an optional leading + and spaces or hyphens as separators
const PHONE_PATTERN = /^\+?(?=(?:\D*\d){7,15}\D*$)[0-9\s-]+$/;
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