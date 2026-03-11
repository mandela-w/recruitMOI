"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Mail,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useSidebar } from "./SidebarContext";
import { getInitials, cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  APPLICANT: "Applicant",
  HR: "HR Manager",
  SUPER_ADMIN: "Super Admin",
};

const ROLE_COLOR: Record<string, string> = {
  APPLICANT: "text-green-700 bg-green-50",
  HR: "text-sky-700   bg-sky-50",
  SUPER_ADMIN: "text-amber-700 bg-amber-50",
};

export function Header() {
  const { user, logout } = useAuthStore();
  const { collapsed } = useSidebar();
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
        ? "Good afternoon"
        : "Good evening";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const sidebarW = collapsed ? "5rem" : "16rem";

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-surface-100 z-50 flex items-center px-6 gap-4 transition-all duration-300"
      style={{ left: sidebarW }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-surface-500 font-body truncate">
          {greeting},{" "}
          <span className="font-semibold text-surface-900">
            {user?.firstName}
          </span>{" "}
          👋
        </p>
      </div>

      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 w-56 transition-all"
        />
      </div>

      <button className="relative p-2 rounded-xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface-100 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user ? getInitials(user.firstName, user.lastName) : "?"}
          </div>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-surface-400 transition-transform duration-200 hidden sm:block",
              profileOpen && "rotate-180",
            )}
          />
        </button>

        {profileOpen && user && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-surface-100 overflow-hidden z-[200] animate-slide-up">
            {/* Profile header */}
            <div className="px-5 py-4 bg-gradient-to-br from-brand-50 to-white border-b border-surface-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-base font-bold shadow-sm flex-shrink-0">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-surface-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-surface-400 truncate">
                    {user.email}
                  </p>
                  <span
                    className={cn(
                      "inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      ROLE_COLOR[user.role] ??
                        "text-surface-600 bg-surface-100",
                    )}
                  >
                    {ROLE_LABEL[user.role] ?? user.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2">
              <DropdownItem
                icon={<User className="w-4 h-4" />}
                label="My Profile"
                sub="View your profile details"
              />
              <DropdownItem
                icon={<Mail className="w-4 h-4" />}
                label="Messages"
                sub="No new messages"
              />
              <DropdownItem
                icon={<Settings className="w-4 h-4" />}
                label="Settings"
                sub="Account preferences"
              />
              {user.role === "SUPER_ADMIN" && (
                <DropdownItem
                  icon={<Shield className="w-4 h-4" />}
                  label="Admin Panel"
                  sub="System administration"
                />
              )}
            </div>

            <div className="px-4 py-2 bg-surface-50 border-t border-surface-100">
              <div className="flex items-center justify-between text-xs text-surface-500">
                <span>Account status</span>
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Active
                </span>
              </div>
            </div>

            <div className="p-2 border-t border-surface-100">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function DropdownItem({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 transition-colors text-left group"
    >
      <span className="text-surface-400 group-hover:text-brand-600 transition-colors flex-shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-surface-900">{label}</p>
        {sub && <p className="text-xs text-surface-400 truncate">{sub}</p>}
      </div>
    </button>
  );
}
