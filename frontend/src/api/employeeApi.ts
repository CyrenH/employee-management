import type { Employee, EmployeeRequest } from "../types/employee";
import { API_BASE_URL, apiClient } from "./client";
import { ApiError, toApiError, type ProblemBody } from "./apiError";

// Overrides apisauce's JSON default, which would turn FormData into a JSON body.
// The browser still adds the multipart boundary itself.
const MULTIPART_CONFIG = { headers: { "Content-Type": "multipart/form-data" } };

class EmployeeApi {

    private baseUrl = "/employees";

    create = async (values: EmployeeRequest, photo: File | null): Promise<Employee> => {
        const body = new FormData();
        // The JSON part must carry its own content type so the server can bind it with @RequestPart
        body.append("employee", new Blob([JSON.stringify(values)], { type: "application/json" }));
        if (photo) body.append("photo", photo);

        const response = await apiClient.post<Employee, ProblemBody>(this.baseUrl, body, MULTIPART_CONFIG);
        if (!response.ok) throw toApiError(response);

        const { data } = response;
        if (!data) throw new ApiError(response.status ?? 0, "Unexpected empty response from the server.");
        return data;
    };

    findAll = async (): Promise<Employee[]> => {
        const response = await apiClient.get<Employee[], ProblemBody>(this.baseUrl);
        if (!response.ok) throw toApiError(response);

        const { data } = response;
        if (!data) throw new ApiError(response.status ?? 0, "Unexpected empty response from the server.");
        return data;
    };

    // Not an API call from our code: the browser requests this URL itself when it renders <img src>.
    // ?v= is a fingerprint of the photo, so a replaced photo is requested under a new URL
    // instead of being served from the browser's cache.
    // Returns null when the employee has no photo, so no request is made.
    photoUrl = (employee: Employee): string | null =>
        employee.photoVersion
            ? `${API_BASE_URL}${this.baseUrl}/${employee.id}/photo?v=${employee.photoVersion}`
            : null;

    findById = async (id: string): Promise<Employee> => {
        const response = await apiClient.get<Employee, ProblemBody>(`${this.baseUrl}/${id}`);
        if (!response.ok) throw toApiError(response);

        const { data } = response;
        if (!data) throw new ApiError(response.status ?? 0, "Unexpected empty response from the server.");
        return data;
    };

    // A new photo replaces the saved one, removePhoto deletes it, and sending neither keeps it
    update = async (
        id: string,
        values: EmployeeRequest,
        photo: File | null,
        removePhoto: boolean,
    ): Promise<Employee> => {
        const body = new FormData();
        body.append("employee", new Blob([JSON.stringify(values)], { type: "application/json" }));
        if (photo) body.append("photo", photo);
        else if (removePhoto) body.append("removePhoto", "true");

        const response = await apiClient.put<Employee, ProblemBody>(`${this.baseUrl}/${id}`, body, MULTIPART_CONFIG);
        if (!response.ok) throw toApiError(response);

        const { data } = response;
        if (!data) throw new ApiError(response.status ?? 0, "Unexpected empty response from the server.");
        return data;
    };

}

export const employeeApi = new EmployeeApi();