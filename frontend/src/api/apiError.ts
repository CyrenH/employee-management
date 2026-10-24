import type { ApiErrorResponse } from "apisauce";

/** Backend error body: RFC 7807 ProblemDetail plus our "errors" map of field messages. */
export interface ProblemBody {
    detail?: string;
    errors?: Record<string, string>;
}

export class ApiError extends Error {
    readonly status: number;
    readonly fieldErrors: Record<string, string>;

    constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

export const toApiError = (response: ApiErrorResponse<ProblemBody>): ApiError => {
    switch (response.problem) {
        case "NETWORK_ERROR":
        case "CONNECTION_ERROR":
        case "TIMEOUT_ERROR":
            return new ApiError(0, "Cannot reach the server. Check your connection and try again.");
        default: {
            // The body may not be JSON (e.g. a proxy error page), so guard before reading it
            const body = typeof response.data === "object" ? response.data : undefined;
            return new ApiError(
                response.status ?? 0,
                body?.detail ?? "Something went wrong. Please try again.",
                body?.errors ?? {},
            );
        }
    }
};