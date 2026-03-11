import { cn, statusConfig, roleConfig } from "@/lib/utils";
import type { ApplicationStatus, Role } from "@/types";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn("status-badge", config.color, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <span className={cn("status-badge", config.color, className)}>
      {config.label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const badgeVariants = {
  default: "text-surface-600 bg-surface-100 border-surface-200",
  success: "text-emerald-700 bg-emerald-50 border-emerald-200",
  warning: "text-amber-700 bg-amber-50 border-amber-200",
  danger: "text-rose-700 bg-rose-50 border-rose-200",
  info: "text-sky-700 bg-sky-50 border-sky-200",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("status-badge", badgeVariants[variant], className)}>
      {children}
    </span>
  );
}
