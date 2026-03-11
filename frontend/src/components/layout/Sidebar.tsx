"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  ClipboardList,
  BarChart3,
  BriefcaseBusiness,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useSidebar } from "./SidebarContext";
import type { Role } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    href: "/applicant/apply",
    label: "Apply Now",
    icon: <FileText className="w-5 h-5" />,
    roles: ["APPLICANT"],
  },
  {
    href: "/applicant/status",
    label: "My Application",
    icon: <ClipboardList className="w-5 h-5" />,
    roles: ["APPLICANT"],
  },
  {
    href: "/dashboard",
    label: "Analytics",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["HR"],
  },
  {
    href: "/admin/dashboard",
    label: "Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/hr/applicants",
    label: "Applicants",
    icon: <Users className="w-5 h-5" />,
    roles: ["HR", "SUPER_ADMIN"],
  },
  {
    href: "/admin/users",
    label: "Manage Users",
    icon: <UserCircle className="w-5 h-5" />,
    roles: ["SUPER_ADMIN"],
  },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-[100] flex flex-col",
        "bg-white border-r border-surface-100 shadow-sm",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-surface-100",
          collapsed ? "justify-center" : "gap-3",
        )}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow flex-shrink-0">
          <BriefcaseBusiness className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in min-w-0">
            <span className="font-display font-bold text-surface-900 text-lg tracking-tight">
              Recruit<span className="text-brand-600">Moi</span>
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "nav-item relative",
                isActive && "nav-item-active",
                collapsed && "justify-center px-2",
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="truncate animate-fade-in">{item.label}</span>
              )}
              {isActive && (
                <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-surface-100 p-3 space-y-1">
        {user && (
          <div
            className={cn(
              "flex items-center gap-3 px-2 py-2 rounded-xl",
              collapsed && "justify-center",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {getInitials(user.firstName, user.lastName)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-semibold text-surface-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => logout()}
          className={cn(
            "nav-item w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50",
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="animate-fade-in">Sign Out</span>}
        </button>
      </div>

      <button
        onClick={toggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-surface-200 shadow-sm flex items-center justify-center text-surface-400 hover:text-brand-600 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}
