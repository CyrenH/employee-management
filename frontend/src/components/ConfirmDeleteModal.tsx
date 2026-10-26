import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core";
import type { Employee } from "../types/employee";

interface ConfirmDeleteModalProps {
    employee: Employee | null;
    opened: boolean;
    deleting: boolean;
    error: string | null;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmDeleteModal = ({ employee, opened, deleting, error, onConfirm, onClose }: ConfirmDeleteModalProps) => (
    <Modal
        opened={opened}
        onClose={onClose}
        title="Delete Employee"
        centered
        // The dialog can't be dismissed while the request is in flight
        closeOnClickOutside={!deleting}
        closeOnEscape={!deleting}
        withCloseButton={!deleting}
        styles={{
            title: {
                fontSize: "var(--mantine-h4-font-size)",
                fontWeight: 700,
            },
        }}
    >
        {employee && (
            <Stack gap="md">
                {error && <Alert color="red">{error}</Alert>}

                <Text style={{ overflowWrap: "anywhere" }}>
                    Are you sure you want to delete <strong>{employee.name}</strong>? This removes
                    the employee and their photo, and it can't be undone.
                </Text>

                <Group justify="flex-end">
                    {/* data-autofocus: focus starts on the safe choice, so a stray Enter can't delete anyone */}
                    <Button variant="default" onClick={onClose} disabled={deleting} data-autofocus>
                        Cancel
                    </Button>
                    <Button color="red" onClick={onConfirm} loading={deleting}>
                        Delete
                    </Button>
                </Group>
            </Stack>
        )}
    </Modal>
);

export default ConfirmDeleteModal;