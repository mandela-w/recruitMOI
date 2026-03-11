"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/layout/SidebarContext";
import { ToastProvider } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/authStore";

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const sidebarW = collapsed ? "5rem" : "16rem";

  return (
    <div className="min-h-screen bg-mesh">
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarW }}
      >
        <Header />
        <main className="pt-16 min-h-screen">
          <div className="p-6 animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) return null;

  return (
    <ToastProvider>
      <SidebarProvider>
        <DashboardInner>{children}</DashboardInner>
      </SidebarProvider>
    </ToastProvider>
  );
}
