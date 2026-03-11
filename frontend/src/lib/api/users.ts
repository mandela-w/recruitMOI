import apiClient from "./client";
import type {
  User,
  UserFilters,
  PaginatedResponse,
  DashboardStats,
} from "@/types";
import type {
  CreateUserFormData,
  UpdateUserFormData,
} from "@/lib/validators/schemas";
import { MOCK_DASHBOARD_STATS, MOCK_USERS_LIST } from "@/lib/mock/data";

const USE_MOCK = true;

export const userRepository = {
  async getAll(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      let list = [...MOCK_USERS_LIST] as User[];
      if (filters?.role) list = list.filter((u) => u.role === filters.role);
      if (filters?.isActive !== undefined)
        list = list.filter((u) => u.isActive === filters.isActive);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (u) =>
            u.firstName.toLowerCase().includes(q) ||
            u.lastName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        );
      }
      return {
        data: list,
        total: list.length,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      };
    }
    const { data } = await apiClient.get<PaginatedResponse<User>>("/users", {
      params: filters,
    });
    return data;
  },

  async getById(id: string): Promise<User> {
    if (USE_MOCK) {
      const found = MOCK_USERS_LIST.find((u) => u.id === id) as User;
      if (!found) throw { message: "User not found" };
      return found;
    }
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  async create(userData: CreateUserFormData): Promise<User> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return {
        id: `mock-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role as User["role"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const { confirmPassword: _, ...payload } = userData;
    const { data } = await apiClient.post<User>("/users", payload);
    return data;
  },

  async update(id: string, userData: UpdateUserFormData): Promise<User> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const found = MOCK_USERS_LIST.find((u) => u.id === id) as User;
      return { ...found, ...userData, updatedAt: new Date().toISOString() };
    }
    const { data } = await apiClient.put<User>(`/users/${id}`, userData);
    return data;
  },

  async toggleStatus(id: string): Promise<User> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const found = { ...(MOCK_USERS_LIST.find((u) => u.id === id) as User) };
      found.isActive = !found.isActive;
      return found;
    }
    const { data } = await apiClient.patch<User>(`/users/${id}/toggle-status`);
    return data;
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return;
    }
    await apiClient.delete(`/users/${id}`);
  },
};

export const dashboardRepository = {
  async getStats(): Promise<DashboardStats> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return MOCK_DASHBOARD_STATS as DashboardStats;
    }
    const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
    return data;
  },
};
