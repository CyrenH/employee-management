import { create } from "apisauce";

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const apiClient = create({
    baseURL: API_BASE_URL,
    headers: { Accept: "application/json" },
    timeout: 15_000,
});