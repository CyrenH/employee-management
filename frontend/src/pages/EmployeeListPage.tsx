import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { ApiError } from "../api/apiError";
import { employeeApi } from "../api/employeeApi";
import EmployeeList from "../components/EmployeeList";
import EmployeeViewModal from "../components/EmployeeViewModal";
import type { Employee } from "../types/employee";
import { notifications } from "@mantine/notifications";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const EmployeeListPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    // The selected employee is kept after the modal closes, so the content doesn't vanish mid-animation
    const [selected, setSelected] = useState<Employee | null>(null);
    const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);

    const [toDelete, setToDelete] = useState<Employee | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    // True when the delete started from the details, so Cancel can take the user back to them
    const [returnToView, setReturnToView] = useState(false);

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

    const handleDeleteRequest = (employee: Employee) => {
        setToDelete(employee);
        setDeleteError(null);
        setReturnToView(false);
        openDelete();
    };

    const handleDeleteConfirm = async () => {
        if (!toDelete) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await employeeApi.remove(toDelete.id);
            closeDelete();
            setReturnToView(false);
            notifications.show({ color: "green", title: "Employee deleted", message: `${toDelete.name} was removed.` });
            handleReload();
        } catch (e) {
            if (e instanceof ApiError && e.status === 404) {
                // Someone else already deleted it: the goal is reached, so just refresh the list
                closeDelete();
                setReturnToView(false);
                notifications.show({
                    color: "yellow",
                    title: "Already deleted",
                    message: `${toDelete.name} no longer exists.`,
                });
                handleReload();
            } else {
                // Keep the dialog open so the user can retry or cancel
                setDeleteError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
            }
        } finally {
            setDeleting(false);
        }
    };

    // Close the details first, then ask for confirmation, so two dialogs are never stacked
    const handleDeleteFromView = (employee: Employee) => {
        closeView();
        handleDeleteRequest(employee);
        setReturnToView(true);
    };

    // Cancel, Escape, or a click outside: go back to the details if that's where the user came from
    const handleDeleteCancel = () => {
        closeDelete();
        if (returnToView) openView();
        setReturnToView(false);
    };

    return (
        <>
            <EmployeeList
                employees={employees}
                loading={loading}
                error={error}
                onRetry={handleReload}
                onView={handleView}
                onDelete={handleDeleteRequest}
            />
            <EmployeeViewModal
                employee={selected}
                opened={viewOpened}
                onClose={closeView}
                onDelete={handleDeleteFromView}
            />
            <ConfirmDeleteModal
                employee={toDelete}
                opened={deleteOpened}
                deleting={deleting}
                error={deleteError}
                onConfirm={handleDeleteConfirm}
                onClose={handleDeleteCancel}
            />
        </>
    );
};

export default EmployeeListPage;