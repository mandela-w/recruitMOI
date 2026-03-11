"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRepository, dashboardRepository } from "@/lib/api/users";
import type { UserFilters } from "@/types";
import type { CreateUserFormData, UpdateUserFormData } from "@/lib/validators/schemas";

export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (filters: UserFilters) => [...USER_KEYS.lists(), filters] as const,
  detail: (id: string) => [...USER_KEYS.all, "detail", id] as const,
};

export const DASHBOARD_KEYS = {
  stats: ["dashboard-stats"] as const,
};

// ── Hook: paginated users list ────────────────────────────────
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: USER_KEYS.list(filters ?? {}),
    queryFn: () => userRepository.getAll(filters),
  });
}

// ── Hook: single user ─────────────────────────────────────────
export function useUser(id: string) {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => userRepository.getById(id),
    enabled: !!id,
  });
}

// ── Hook: create user ─────────────────────────────────────────
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserFormData) => userRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
  });
}

// ── Hook: update user ─────────────────────────────────────────
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserFormData) => userRepository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
  });
}

// ── Hook: toggle user status ──────────────────────────────────
export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userRepository.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
  });
}

// ── Hook: delete user ─────────────────────────────────────────
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
  });
}

// ── Hook: dashboard stats ─────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats,
    queryFn: dashboardRepository.getStats,
    staleTime: 2 * 60 * 1000, // 2 min
  });
}
