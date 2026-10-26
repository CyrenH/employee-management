// Values match the backend enum names; labels are what the user sees
export const DEPARTMENTS = ["IT", "FINANCE", "SECURITY"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const DEPARTMENT_LABELS: Record<Department, string> = {
    IT: "IT",
    FINANCE: "Finance",
    SECURITY: "Security",
};

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((d) => ({
    value: d,
    label: DEPARTMENT_LABELS[d],
}));

/** Shape sent to the backend (the "employee" part of the multipart request). */
export interface EmployeeRequest {
    name: string;
    department: Department;
    active: boolean;
    number: string;
    email: string;
    address: string;
}

/** Shape of the form state. Department is null until the user picks one. */
export interface EmployeeFormValues extends Omit<EmployeeRequest, "department"> {
    department: Department | null;
}

export interface Employee extends EmployeeRequest {
    id: string;
    photoVersion: string | null; // null when there is no photo; changes whenever the photo changes
}