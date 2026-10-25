import { Avatar, Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import { employeeApi } from "../api/employeeApi";
import { DEPARTMENT_LABELS, type Employee } from "../types/employee";

interface EmployeeCardProps {
    employee: Employee;
    onView: (employee: Employee) => void;
}

const EmployeeCard = ({ employee, onView }: EmployeeCardProps) => {
    const handleView = () => onView(employee);

    return (
        <Card withBorder radius="md" padding="md">
            <Stack gap="sm">
                <Group wrap="nowrap" align="flex-start">
                    {/* Only request the photo when one exists; otherwise the avatar shows the initials */}
                    <Avatar
                        src={employee.hasPhoto ? employeeApi.photoUrl(employee.id) : null}
                        name={employee.name}
                        color="initials"
                        alt={`Photo of ${employee.name}`}
                        size={64}
                        radius="md"
                    />
                    <Stack gap={4} miw={0}>
                        <Text fw={600} truncate>{employee.name}</Text>
                        <Group gap="xs">
                            <Badge variant="light">{DEPARTMENT_LABELS[employee.department]}</Badge>
                            <Badge variant="light" color={employee.active ? "green" : "gray"}>
                                {employee.active ? "Active" : "Inactive"}
                            </Badge>
                        </Group>
                    </Stack>
                </Group>

                <Group justify="flex-end">
                    <Button size="xs" variant="light" onClick={handleView} aria-label={`View ${employee.name}`}>
                        View
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};

export default EmployeeCard;