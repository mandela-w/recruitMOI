import apiClient from "./client";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  ApiResponse,
} from "@/types";

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<
      ApiResponse<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
        user: User;
      }>
    >("/auth/login", credentials);

    return {
      user: data.data.user,
      token: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post<
      ApiResponse<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
        user: User;
      }>
    >("/auth/register", userData);

    return {
      user: data.data.user,
      token: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const { data } = await apiClient.post<
      ApiResponse<{
        accessToken: string;
        refreshToken: string;
      }>
    >("/auth/refresh-token", { refreshToken });

    return { token: data.data.accessToken };
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>("/me");
    return data.data;
  },
};
