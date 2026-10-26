import { useEffect, useState } from "react";
import { Alert, Anchor, Button, Center, Loader, Stack, Text } from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router";
import { ApiError } from "../api/apiError";
import { employeeApi } from "../api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";
import type { Employee } from "../types/employee";

const EmployeeEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    // Loads the one employee from the URL, so a browser refresh or a pasted link still works
    useEffect(() => {

        if (!id) return; // the route always provides an id

        // Set in the cleanup, so a slow, outdated response can't overwrite newer data
        let ignore = false;

        const loadEmployee = async () => {
            try {
                const data = await employeeApi.findById(id);
                if (ignore) return;
                setEmployee(data);
                setError(null);
            } catch (e) {
                if (ignore) return;
                if (e instanceof ApiError && (e.status === 404 || e.status === 400)) {
                    // Unknown or malformed id: show "not found" instead of an error with Retry
                    setEmployee(null);
                    setError(null);
                } else {
                    setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        loadEmployee();

        return () => {
            ignore = true;
        };
    }, [id, reloadKey]);

    const handleRetry = () => {
        setLoading(true);
        setReloadKey((key) => key + 1);
    };

    const handleSaved = () => navigate("/employees");

    return (
        <Stack maw={1100} mx="auto" gap="md">
            <Anchor component={Link} to="/employees" size="sm">← Back to Employees</Anchor>

            {loading && (
                <Center py="xl">
                    <Loader aria-label="Loading employee" />
                </Center>
            )}

            {!loading && error && (
                <Alert color="red" title="Could not load the employee">
                    <Stack gap="xs" align="flex-start">
                        <Text size="sm">{error}</Text>
                        <Button size="xs" variant="light" color="red" onClick={handleRetry}>Retry</Button>
                    </Stack>
                </Alert>
            )}

            {!loading && !error && !employee && (
                <Text c="dimmed" ta="center" py="xl">
                    Employee not found. It may have been deleted.
                </Text>
            )}

            {/* The key makes the form start fresh if the route ever switches to another employee */}
            {!loading && !error && employee && (
                <EmployeeForm key={employee.id} employee={employee} onSaved={handleSaved} />
            )}
        </Stack>
    );
};

export default EmployeeEditPage;