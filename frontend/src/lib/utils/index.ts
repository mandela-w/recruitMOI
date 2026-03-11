import { type ClassValue, clsx } from "clsx";

// ── className merge utility ───────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ── Status badge helpers ──────────────────────────────────────
export const statusConfig = {
  DRAFT: {
    label: "Draft",
    color: "text-surface-500 bg-surface-100 border-surface-200",
    dot: "bg-surface-400",
  },
  SUBMITTED: {
    label: "Submitted",
    color: "text-sky-700 bg-sky-50 border-sky-200",
    dot: "bg-sky-500",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  APPROVED: {
    label: "Approved",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-rose-700 bg-rose-50 border-rose-200",
    dot: "bg-rose-500",
  },
} as const;

export const roleConfig = {
  APPLICANT: {
    label: "Applicant",
    color: "text-brand-700 bg-brand-50 border-brand-200",
  },
  HR: {
    label: "HR Manager",
    color: "text-violet-700 bg-violet-50 border-violet-200",
  },
  SUPER_ADMIN: {
    label: "Super Admin",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
} as const;

// ── Date formatting ───────────────────────────────────────────
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-RW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-RW", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return formatDate(dateString);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "Just now";
}

// ── String helpers ────────────────────────────────────────────
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── File helpers ──────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(
    (type) => file.type === type || file.name.endsWith(type.replace(".", ""))
  );
}

// ── Number helpers ────────────────────────────────────────────
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-RW").format(num);
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// ── Color helpers for charts ──────────────────────────────────
export const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
  "#84cc16",
];
