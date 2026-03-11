import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, LoginCredentials, RegisterData } from "@/types";
import { authRepository } from "@/lib/api/auth";
import { MOCK_USERS, MOCK_TOKEN, MOCK_REFRESH_TOKEN } from "@/lib/mock/data";

// ── Set to false when your Spring Boot backend is running ─────
const USE_MOCK = true;

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

async function mockLogin(credentials: LoginCredentials) {
  await new Promise((r) => setTimeout(r, 600));
  const found = MOCK_USERS[credentials.email];
  if (!found || found.password !== credentials.password) {
    throw { message: "Invalid email or password. Try the demo buttons above." };
  }
  return {
    user: found.user,
    token: MOCK_TOKEN,
    refreshToken: MOCK_REFRESH_TOKEN,
  };
}

async function mockRegister(data: RegisterData) {
  await new Promise((r) => setTimeout(r, 700));
  const user: User = {
    id: `mock-${Date.now()}`,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: "APPLICANT",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return { user, token: MOCK_TOKEN, refreshToken: MOCK_REFRESH_TOKEN };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = USE_MOCK
            ? await mockLogin(credentials)
            : await authRepository.login(credentials);
          localStorage.setItem("auth_token", response.token);
          localStorage.setItem("refresh_token", response.refreshToken);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message =
            (error as { message?: string })?.message ||
            "Login failed. Please try again.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = USE_MOCK
            ? await mockRegister(data)
            : await authRepository.register(data);
          localStorage.setItem("auth_token", response.token);
          localStorage.setItem("refresh_token", response.refreshToken);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message =
            (error as { message?: string })?.message ||
            "Registration failed. Please try again.";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          if (!USE_MOCK) await authRepository.logout();
        } finally {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      clearError: () => set({ error: null }),
      setUser: (user) => set({ user }),

      initialize: async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }
        if (USE_MOCK) return; // trust persisted session in mock mode
        try {
          const user = await authRepository.getCurrentUser();
          set({ user, token, isAuthenticated: true });
        } catch {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
