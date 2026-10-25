import { Avatar, Badge, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { employeeApi } from "../api/employeeApi";
import { DEPARTMENT_LABELS, type Employee } from "../types/employee";

interface EmployeeViewModalProps {
    employee: Employee | null;
    opened: boolean;
    onClose: () => void;
}

interface DetailRowProps {
    label: string;
    value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
    <div>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{label}</Text>
        {/* pre-wrap keeps the line breaks the user typed in the address */}
        <Text style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{value}</Text>
    </div>
);

const EmployeeViewModal = ({ employee, opened, onClose }: EmployeeViewModalProps) => (
    <Modal
        opened={opened}
        onClose={onClose}
        title="Employee Details"
        centered
        styles={{
            title: {
                fontSize: 'var(--mantine-h4-font-size)',
                fontWeight: 700,
            },
        }}
    >
        {employee && (
            <Stack gap="md">
                <Group wrap="nowrap" align="flex-start">
                    {/* Only request the photo when one exists; otherwise the avatar shows the initials */}
                    <Avatar
                        src={employee.hasPhoto ? employeeApi.photoUrl(employee.id) : null}
                        name={employee.name}
                        color="initials"
                        alt={`Photo of ${employee.name}`}
                        size={96}
                        radius="md"
                    />
                    <Stack gap="xs" miw={0}>
                        <Title order={3} style={{ overflowWrap: "anywhere" }}>{employee.name}</Title>
                        <Group gap="xs">
                            <Badge variant="light">{DEPARTMENT_LABELS[employee.department]}</Badge>
                            <Badge variant="light" color={employee.active ? "green" : "gray"}>
                                {employee.active ? "Active" : "Inactive"}
                            </Badge>
                        </Group>
                    </Stack>
                </Group>

                <DetailRow label="Phone Number" value={employee.number} />
                <DetailRow label="Email" value={employee.email} />
                <DetailRow label="Address" value={employee.address} />
            </Stack>
        )}
    </Modal>
);

export default EmployeeViewModal;