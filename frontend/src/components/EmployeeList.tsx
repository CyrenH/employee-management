import { Alert, Badge, Button, Center, Group, Loader, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";
import type { Employee } from "../types/employee";
import EmployeeCard from "./EmployeeCard";

interface EmployeeListProps {
    employees: Employee[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    onView: (employee: Employee) => void;
}

const EmployeeList = ({ employees, loading, error, onRetry, onView }: EmployeeListProps) => {
    // A full spinner only before the first data arrives; later refreshes keep the list visible
    if (loading && employees.length === 0) {
        return (
            <Center py="xl">
                <Loader aria-label="Loading Employees" />
            </Center>
        );
    }

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Group gap="xs">
                    <Title order={2} size="h3">Employees</Title>
                    <Badge variant="light" size="lg">{employees.length}</Badge>
                </Group>
                <Button component={Link} to="/employees/new">Add Employee</Button>
            </Group>

            {error && (
                <Alert color="red" title="Could not load employees">
                    <Stack gap="xs" align="flex-start">
                        <Text size="sm">{error}</Text>
                        <Button size="xs" variant="light" color="red" onClick={onRetry}>Retry</Button>
                    </Stack>
                </Alert>
            )}

            {!error && employees.length === 0 && (
                <Text c="dimmed" ta="center" py="xl">
                    No Employees yet. Use "Add Employee" to create the first one.
                </Text>
            )}

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {employees.map((employee) => (
                    <EmployeeCard key={employee.id} employee={employee} onView={onView}/>
                ))}
            </SimpleGrid>
        </Stack>
    );
};

export default EmployeeList;