import { Anchor, Stack } from "@mantine/core";
import { Link, useNavigate } from "react-router";
import EmployeeForm from "../components/EmployeeForm";

const EmployeeCreatePage = () => {
    const navigate = useNavigate();

    const handleCreated = () => navigate("/employees");

    return (
        <Stack maw={1100} mx="auto" gap="md">
            <Anchor component={Link} to="/employees" size="sm">← Back to Employees</Anchor>
            <EmployeeForm onCreated={handleCreated} />
        </Stack>
    );
};

export default EmployeeCreatePage;