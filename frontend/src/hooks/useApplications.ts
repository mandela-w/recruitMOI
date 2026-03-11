"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationRepository } from "@/lib/api/applications";
import type { ApplicationFilters, ReviewFormData } from "@/types";

export const APPLICATION_KEYS = {
  all: ["applications"] as const,
  lists: () => [...APPLICATION_KEYS.all, "list"] as const,
  list: (filters: ApplicationFilters) => [...APPLICATION_KEYS.lists(), filters] as const,
  details: () => [...APPLICATION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...APPLICATION_KEYS.details(), id] as const,
  mine: () => [...APPLICATION_KEYS.all, "mine"] as const,
};

// ── Hook: latest HR applicants (alphabetical, max 10) ──────────
export function useLatestApplications(filters?: ApplicationFilters) {
  return useQuery({
    queryKey: APPLICATION_KEYS.list(filters ?? {}),
    queryFn: () => applicationRepository.getLatest(filters),
  });
}

// ── Hook: single application detail ──────────────────────────
export function useApplication(id: string) {
  return useQuery({
    queryKey: APPLICATION_KEYS.detail(id),
    queryFn: () => applicationRepository.getById(id),
    enabled: !!id,
  });
}

// ── Hook: current user's own application ─────────────────────
export function useMyApplication() {
  return useQuery({
    queryKey: APPLICATION_KEYS.mine(),
    queryFn: applicationRepository.getMyApplication,
    retry: 1,
  });
}

// ── Hook: review mutation ─────────────────────────────────────
export function useReviewApplication(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewFormData) => applicationRepository.review(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
