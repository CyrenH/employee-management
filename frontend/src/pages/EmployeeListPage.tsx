import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ApiError } from "../api/apiError";
import { employeeApi } from "../api/employeeApi";
import EmployeeList from "../components/EmployeeList";
import EmployeeViewModal from "../components/EmployeeViewModal";
import type { Employee } from "../types/employee";

const EmployeeListPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    // The selected employee is kept after the modal closes, so the content doesn't vanish mid-animation
    const [selected, setSelected] = useState<Employee | null>(null);
    const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);

    // Loads when the page mounts, so coming back from the create page shows the new employee
    useEffect(() => {
        // Set in the cleanup, so a slow, outdated response can't overwrite newer data
        let ignore = false;

        const loadEmployees = async () => {
            try {
                const data = await employeeApi.findAll();
                if (ignore) return;
                setEmployees(data);
                setError(null);
            } catch (e) {
                if (ignore) return;
                setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        loadEmployees();

        return () => {
            ignore = true;
        };
    }, [reloadKey]);

    const handleReload = () => {
        setLoading(true);
        setReloadKey((key) => key + 1);
    };

    const handleView = (employee: Employee) => {
        setSelected(employee);
        openView();
    };

    return (
        <>
            <EmployeeList
                employees={employees}
                loading={loading}
                error={error}
                onRetry={handleReload}
                onView={handleView}
            />
            <EmployeeViewModal employee={selected} opened={viewOpened} onClose={closeView} />
        </>
    );
};

export default EmployeeListPage;