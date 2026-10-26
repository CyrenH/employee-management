import { Avatar, Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import { employeeApi } from "../api/employeeApi";
import { DEPARTMENT_LABELS, type Employee } from "../types/employee";
import { Link } from "react-router";

interface EmployeeCardProps {
    employee: Employee;
    onView: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
}

const EmployeeCard = ({ employee, onView, onDelete }: EmployeeCardProps) => {

    const handleView = () => onView(employee);
    const handleDelete = () => onDelete(employee);

    return (
        <Card withBorder radius="md" padding="md">
            <Stack gap="sm">
                <Group wrap="nowrap" align="flex-start">
                    {/* Only request the photo when one exists; otherwise the avatar shows the initials */}
                    <Avatar
                        src={employeeApi.photoUrl(employee)}
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
                    <Button
                        component={Link}
                        to={`/employees/${employee.id}/edit`}
                        size="xs"
                        variant="default"
                        aria-label={`Edit ${employee.name}`}
                    >
                        Edit
                    </Button>
                    <Button size="xs" variant="light" onClick={handleView} aria-label={`View ${employee.name}`}>
                        View
                    </Button>
                    <Button
                        size="xs"
                        variant="light"
                        color="red"
                        onClick={handleDelete}
                        aria-label={`Delete ${employee.name}`}
                    >
                        Delete
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};

export default EmployeeCard;