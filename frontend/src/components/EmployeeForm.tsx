import { useState } from "react";
import {
    Alert, Button, Checkbox, Fieldset, Group, Paper, Select, Stack, TextInput, Textarea
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ApiError } from "../api/apiError";
import { employeeApi } from "../api/employeeApi";
import { DEPARTMENT_OPTIONS, type Employee, type EmployeeFormValues } from "../types/employee";
import { validatePhoto } from "../utils/photo";
import { employeeValidators } from "../validation/employeeValidation";
import PhotoPicker from "./PhotoPicker";

interface EmployeeFormProps {
    employee?: Employee; // present = edit mode; absent = create mode
    onSaved: () => void;
}

const EMPTY_VALUES: EmployeeFormValues = {
    name: "",
    department: null,
    active: true,
    number: "",
    email: "",
    address: "",
};

const toFormValues = (employee: Employee): EmployeeFormValues => ({
    name: employee.name,
    department: employee.department,
    active: employee.active,
    number: employee.number,
    email: employee.email,
    address: employee.address,
});

const EmployeeForm = ({ employee, onSaved }: EmployeeFormProps) => {

    const isEdit = employee !== undefined;

    const form = useForm<EmployeeFormValues>({
        mode: "uncontrolled", // avoids re-rendering the whole form on every keystroke
        initialValues: employee ? toFormValues(employee) : EMPTY_VALUES,
        validate: employeeValidators,
        validateInputOnBlur: true,
        transformValues: (values) => ({
            ...values,
            name: values.name.trim(),
            number: values.number.trim(),
            email: values.email.trim(),
            address: values.address.trim(),
        }),
    });

    const [photo, setPhoto] = useState<File | null>(null);
    const [removeSavedPhoto, setRemoveSavedPhoto] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // The saved photo stays visible until the user removes it or picks a new file
    const savedPhotoUrl = employee && !removeSavedPhoto ? employeeApi.photoUrl(employee) : null;

    // Create mode: blank form. Edit mode: back to the saved values and the saved photo.
    const handleClear = () => {
        form.reset(); // restores initial values and clears validation errors
        setPhoto(null);
        setRemoveSavedPhoto(false);
        setPhotoError(null);
        setFormError(null);
    };

    const handlePhotoSelect = (file: File) => {
        const message = validatePhoto(file);
        if (message) {
            setPhotoError(message); // keep the current photo and just explain why the file was rejected
            return;
        }
        setPhoto(file);
        setRemoveSavedPhoto(false);
        setPhotoError(null);
    };

    const applyServerError = (error: unknown) => {
        if (!(error instanceof ApiError)) {
            setFormError("Something went wrong. Please try again.");
            return;
        }
        const entries = Object.entries(error.fieldErrors);
        if (entries.length === 0) {
            setFormError(error.message);
            return;
        }
        for (const [field, message] of entries) {
            if (field === "photo") setPhotoError(message);
            else if (field in EMPTY_VALUES) form.setFieldError(field as keyof EmployeeFormValues, message);
            else setFormError(message);
        }
    };

    const handleSubmit = async (values: EmployeeFormValues) => {
        if (!values.department) return;
        const request = { ...values, department: values.department };
        setFormError(null);
        setSubmitting(true);
        try {
            if (employee) {
                await employeeApi.update(employee.id, request, photo, removeSavedPhoto);
            } else {
                await employeeApi.create(request, photo);
            }
            onSaved(); // the page navigates back to the list
            notifications.show({
                color: "green",
                title: isEdit ? "Employee updated" : "Employee created",
                message: isEdit ? "The changes were saved." : "The employee was saved.",
            });
        } catch (error) {
            applyServerError(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePhotoRemove = () => {
        setPhoto(null);
        setPhotoError(null);
        // Without a saved photo there is nothing to delete on the server
        if (employee?.photoVersion) setRemoveSavedPhoto(true);
    };

    return (
        <Paper withBorder p="lg" radius="md">
            {/* noValidate: show our messages instead of the browser's built-in ones */}
            <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
                {/* A disabled fieldset disables every field inside it while the request is in flight */}
                <Fieldset
                    legend={isEdit ? "Edit Employee" : "Create Employee"}
                    disabled={submitting}
                    styles={{
                        legend: {
                            fontSize: 'var(--mantine-h4-font-size)',
                            fontWeight: 700,
                        },
                    }}
                >
                    <Stack gap="md">

                        {employee && (
                            <Alert color="blue" variant="light" title="Edit mode">
                                You are editing <strong>{employee.name}</strong>. Changes are saved when you click Update.
                            </Alert>
                        )}

                        {formError && <Alert color="red">{formError}</Alert>}

                        <TextInput
                            label="Name" withAsterisk
                            key={form.key("name")} {...form.getInputProps("name")}
                        />
                        <Select
                            label="Department" placeholder="Select a department" withAsterisk allowDeselect={false}
                            data={DEPARTMENT_OPTIONS}
                            key={form.key("department")} {...form.getInputProps("department")}
                        />
                        <Checkbox
                            label="Active"
                            key={form.key("active")} {...form.getInputProps("active", { type: "checkbox" })}
                        />
                        <TextInput
                            label="Phone Number" type="tel" placeholder="+60 12-345 6789" withAsterisk
                            key={form.key("number")} {...form.getInputProps("number")}
                        />
                        <TextInput
                            label="Email" type="email" withAsterisk
                            key={form.key("email")} {...form.getInputProps("email")}
                        />
                        <Textarea
                            label="Address" autosize minRows={2} withAsterisk
                            key={form.key("address")} {...form.getInputProps("address")}
                        />

                        <PhotoPicker
                            file={photo}
                            existingUrl={savedPhotoUrl}
                            error={photoError}
                            onSelect={handlePhotoSelect}
                            onRemove={handlePhotoRemove}
                        />

                        <Group>
                            <Button type="submit" loading={submitting}>{isEdit ? "Update" : "Create"}</Button>
                            <Button type="button" variant="default" onClick={handleClear}>
                                {isEdit ? "Reset" : "Clear"}
                            </Button>
                        </Group>
                    </Stack>
                </Fieldset>
            </form>
        </Paper>
    );
};

export default EmployeeForm;