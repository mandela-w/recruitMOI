import apiClient from "./client";
import type {
  User,
  UserFilters,
  PaginatedResponse,
  DashboardStats,
  ApiResponse,
  ApplicationStatus,
} from "@/types";
import type {
  CreateUserFormData,
  UpdateUserFormData,
} from "@/lib/validators/schemas";

export const userRepository = {
  async getAll(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const params: Record<string, string> = {};
    if (filters?.role) params.role = filters.role;
    if (filters?.search) params.search = filters.search;

    const { data } = await apiClient.get<ApiResponse<User[]>>("/admin/users", {
      params,
    });
    const list = data.data ?? [];
    return {
      data: list,
      total: list.length,
      page: 1,
      pageSize: list.length,
      totalPages: 1,
    };
  },

  async getById(id: string): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(
      `/admin/users/${id}`,
    );
    return data.data;
  },

  async create(userData: CreateUserFormData): Promise<User> {
    const { confirmPassword: _, ...payload } = userData;
    const { data } = await apiClient.post<ApiResponse<User>>(
      "/admin/users",
      payload,
    );
    return data.data;
  },

  async update(id: string, userData: UpdateUserFormData): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      `/admin/users/${id}`,
      userData,
    );
    return data.data;
  },

  async toggleStatus(id: string, currentlyActive: boolean): Promise<User> {
    const endpoint = currentlyActive
      ? `/admin/users/${id}/deactivate`
      : `/admin/users/${id}/activate`;
    await apiClient.patch<ApiResponse<void>>(endpoint);
    const updated = await apiClient.get<ApiResponse<User>>(
      `/admin/users/${id}`,
    );
    return updated.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },
};

// ─── MOCK DATA — demo only, swap getStats body for real API when ready ────────
const MOCK_STATS: DashboardStats = {
  totalApplications: 248,
  pendingReview: 34,
  submitted: 34,
  underReview: 61,
  approved: 112,
  rejected: 41,
  totalUsers: 312,
  activeUsers: 289,
  totalHR: 8,
  totalAdmins: 2,
  totalApplicants: 302,
  approvalRate: 73,
  avgPointsApproved: 14,
  avgPointsRejected: 22,
  recentApplications: [],

  applicationsByStatus: [
    { status: "SUBMITTED" as ApplicationStatus, count: 34 },
    { status: "UNDER_REVIEW" as ApplicationStatus, count: 61 },
    { status: "APPROVED" as ApplicationStatus, count: 112 },
    { status: "REJECTED" as ApplicationStatus, count: 41 },
  ],

  applicationsByMonth: [
    { month: "Jul 2024", count: 12 },
    { month: "Aug 2024", count: 19 },
    { month: "Sep 2024", count: 27 },
    { month: "Oct 2024", count: 34 },
    { month: "Nov 2024", count: 41 },
    { month: "Dec 2024", count: 29 },
    { month: "Jan 2025", count: 38 },
    { month: "Feb 2025", count: 48 },
  ],

  applicationsByProvince: [
    { province: "Kigali", count: 98 },
    { province: "Eastern", count: 42 },
    { province: "Southern", count: 51 },
    { province: "Western", count: 37 },
    { province: "Northern", count: 20 },
  ],

  topPositions: [
    { position: "Software Engineer", count: 54 },
    { position: "Data Analyst", count: 38 },
    { position: "Project Manager", count: 31 },
    { position: "HR Officer", count: 27 },
    { position: "Finance Officer", count: 22 },
    { position: "Network Engineer", count: 18 },
  ],

  ageGroups: [
    { group: "18-24", count: 72 },
    { group: "25-34", count: 118 },
    { group: "35-44", count: 43 },
    { group: "45+", count: 15 },
  ],

  genderBreakdown: [
    { gender: "Male", count: 144 },
    { gender: "Female", count: 104 },
  ],

  divisionBreakdown: [
    { division: "Division I", count: 163 },
    { division: "Division II", count: 85 },
  ],
};

export const dashboardRepository = {
  async getStats(): Promise<DashboardStats> {
    // TODO: replace mock with live API when going to production:
    // const { data } = await apiClient.get<ApiResponse<AnalyticsBackendResponse>>("/admin/analytics");
    return MOCK_STATS;
  },
};

interface AnalyticsBackendResponse {
  totalApplications: number;
  byStatus: { status: string; count: number; percentage: number }[];
  byEducationLevel: {
    educationLevel: string;
    count: number;
    percentage: number;
  }[];
  topHighSchoolCombinations: {
    combination: string;
    count: number;
    percentage: number;
  }[];
  topUniversityFields: {
    combination: string;
    count: number;
    percentage: number;
  }[];
  monthlyTrend: {
    year: number;
    month: number;
    monthName: string;
    count: number;
  }[];
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalHrUsers: number;
  totalApplicants: number;
  approvalRatePercent: number;
  rejectionRatePercent: number;
}
