"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { dashboardRepository } from "@/lib/api/users";
import { Skeleton } from "@/components/ui/Skeleton";
import { CHART_COLORS, statusConfig } from "@/lib/utils";

// ── All chart colors use green palette ────────────────────────
const GREEN = "#059669"; // green-600
const GREEN_LIGHT = "#10b981"; // green-500

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "#0ea5e9",
  UNDER_REVIEW: "#f59e0b",
  APPROVED: "#059669",
  REJECTED: "#f43f5e",
  DRAFT: "#94a3b8",
};

export function ApplicationsChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardRepository.getStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <Skeleton className="h-4 w-40 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="card p-6">
          <Skeleton className="h-4 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-full" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const pieData = stats.applicationsByStatus.map((item) => ({
    name: statusConfig[item.status]?.label || item.status,
    value: item.count,
    status: item.status,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Applications over time */}
      <div className="lg:col-span-2 card p-6">
        <h3 className="font-display font-semibold text-surface-900 mb-6">
          Applications Over Time
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={stats.applicationsByMonth}
            margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GREEN_LIGHT} stopOpacity={0.18} />
                <stop offset="95%" stopColor={GREEN_LIGHT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={GREEN}
              strokeWidth={2.5}
              fill="url(#colorCount)"
              dot={{ fill: GREEN, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Status breakdown */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-surface-900 mb-6">
          By Status
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] || CHART_COLORS[index]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {pieData.map((entry, i) => (
            <div
              key={entry.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: STATUS_COLORS[entry.status] || CHART_COLORS[i],
                  }}
                />
                <span className="text-surface-600">{entry.name}</span>
              </div>
              <span className="font-semibold text-surface-900">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProvinceChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardRepository.getStats,
  });

  if (isLoading)
    return (
      <div className="card p-6">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  if (!stats) return null;

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-surface-900 mb-6">
        Applications by Province
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={stats.applicationsByProvince}
          margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="province"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          />
          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
            fill={GREEN}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
