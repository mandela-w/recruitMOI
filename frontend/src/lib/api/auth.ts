import apiClient from "./client";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "@/types";

// ── Auth Repository (Repository Pattern) ─────────────────────
export const authRepository = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", userData);
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const { data } = await apiClient.post<{ token: string }>("/auth/refresh", {
      refreshToken,
    });
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get<User>("/auth/me");
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },
};
