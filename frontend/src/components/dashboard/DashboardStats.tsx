"use client";

import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { dashboardRepository } from "@/lib/api/users";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { cn, formatNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  change?: string;
  changePositive?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  delay?: number;
}

function StatCard({
  title,
  value,
  change,
  changePositive,
  icon,
  iconBg,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="card p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-surface-500">{title}</p>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            iconBg,
          )}
        >
          {icon}
        </div>
      </div>

      <div className="mt-2">
        <p className="font-display text-3xl font-bold text-surface-900">
          {formatNumber(value)}
        </p>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp
              className={cn(
                "w-3.5 h-3.5",
                changePositive
                  ? "text-emerald-500"
                  : "text-rose-500 rotate-180",
              )}
            />
            <p
              className={cn(
                "text-xs font-medium",
                changePositive ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {change}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardRepository.getStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      change: "+12% this month",
      changePositive: true,
      icon: <FileText className="w-5 h-5 text-brand-600" />,
      iconBg: "bg-brand-50",
    },
    {
      title: "Under Review",
      value: stats.underReview,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-50",
    },
    {
      title: "Approved",
      value: stats.approved,
      change: "+5 this week",
      changePositive: true,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      iconBg: "bg-rose-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <StatCard key={card.title} {...card} delay={i * 60} />
      ))}
    </div>
  );
}
