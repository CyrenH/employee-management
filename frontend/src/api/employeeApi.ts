import type { Employee, EmployeeRequest } from "../types/employee";
import { apiClient } from "./client";
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
}

export const employeeApi = new EmployeeApi();