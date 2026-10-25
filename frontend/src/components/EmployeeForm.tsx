import { useState } from "react";
import {
    Alert, Button, Checkbox, Fieldset, Group, Paper, Select, Stack, TextInput, Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ApiError } from "../api/apiError";
import { employeeApi } from "../api/employeeApi";
import { DEPARTMENT_OPTIONS, type EmployeeFormValues } from "../types/employee";
import { validatePhoto } from "../utils/photo";
import { employeeValidators } from "../validation/employeeValidation";
import PhotoPicker from "./PhotoPicker";

interface EmployeeFormProps {
    onCreated: () => void;
}

const INITIAL_VALUES: EmployeeFormValues = {
    name: "",
    department: null,
    active: true,
    number: "",
    email: "",
    address: "",
};

const EmployeeForm = ({ onCreated }: EmployeeFormProps) => {
    const form = useForm<EmployeeFormValues>({
        mode: "uncontrolled", // avoids re-rendering the whole form on every keystroke
        initialValues: INITIAL_VALUES,
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
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleClear = () => {
        form.reset(); // restores initial values and clears validation errors
        setPhoto(null);
        setPhotoError(null);
        setFormError(null);
    };

    const handlePhotoSelect = (file: File) => {
        const message = validatePhoto(file);
        setPhoto(message ? null : file);
        setPhotoError(message);
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
            else if (field in INITIAL_VALUES) form.setFieldError(field as keyof EmployeeFormValues, message);
            else setFormError(message);
        }
    };

    const handleSubmit = async (values: EmployeeFormValues) => {
        if (!values.department) return;
        setFormError(null);
        setSubmitting(true);
        try {
            await employeeApi.create({ ...values, department: values.department }, photo);
            handleClear();
            onCreated(); // the create page navigates back to the list
            notifications.show({ color: "green", title: "Employee created", message: "The employee was saved." });
        } catch (error) {
            applyServerError(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePhotoRemove = () => {
        setPhoto(null);
        setPhotoError(null);
    };

    return (
        <Paper withBorder p="lg" radius="md">
            {/* noValidate: show our messages instead of the browser's built-in ones */}
            <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
                {/* A disabled fieldset disables every field inside it while the request is in flight */}
                <Fieldset
                    legend="Create Employee"
                    disabled={submitting}
                    styles={{
                        legend: {
                            fontSize: 'var(--mantine-h4-font-size)',
                            fontWeight: 700,
                        },
                    }}
                >
                    <Stack gap="md">
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
                            error={photoError}
                            onSelect={handlePhotoSelect}
                            onRemove={handlePhotoRemove}
                        />

                        <Group>
                            <Button type="submit" loading={submitting}>Create</Button>
                            <Button type="button" variant="default" onClick={handleClear}>Clear</Button>
                        </Group>
                    </Stack>
                </Fieldset>
            </form>
        </Paper>
    );
};

export default EmployeeForm;