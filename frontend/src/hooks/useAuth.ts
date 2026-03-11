"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types";

// ── Hook: access auth state from anywhere ─────────────────────
export function useAuth() {
  return useAuthStore((s) => ({
    user: s.user,
    token: s.token,
    isAuthenticated: s.isAuthenticated,
    isLoading: s.isLoading,
    error: s.error,
    login: s.login,
    register: s.register,
    logout: s.logout,
    clearError: s.clearError,
  }));
}

// ── Hook: route guard — redirect if not authenticated ─────────
export function useRequireAuth(redirectTo = "/login") {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading };
}

// ── Hook: require specific role(s) ───────────────────────────
export function useRequireRole(allowedRoles: Role[], redirectTo = "/dashboard") {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.replace(redirectTo);
    }
  }, [user, allowedRoles, redirectTo, router]);

  return { user, hasAccess: !!user && allowedRoles.includes(user.role) };
}

// ── Hook: check if user has a role ───────────────────────────
export function useHasRole(...roles: Role[]) {
  const user = useAuthStore((s) => s.user);
  return !!user && roles.includes(user.role);
}
