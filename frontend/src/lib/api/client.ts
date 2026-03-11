import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// ── Create axios instance ─────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor - attach JWT ──────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor - handle errors & token refresh ─────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem("auth_token", data.token);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
        }
        return apiClient(originalRequest);
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    const apiError: ApiError = {
      message: (error.response?.data as { message?: string })?.message || "An unexpected error occurred",
      code: (error.response?.data as { code?: string })?.code || "UNKNOWN_ERROR",
      errors: (error.response?.data as { errors?: Record<string, string[]> })?.errors,
      status: error.response?.status || 500,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
export { API_BASE_URL };
