import { create } from "apisauce";

export const apiClient = create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
    headers: { Accept: "application/json" },
    timeout: 15_000,
});