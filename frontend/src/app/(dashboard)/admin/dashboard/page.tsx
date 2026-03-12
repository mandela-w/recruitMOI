"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  UserCheck,
  Shield,
  Award,
  Target,
  BarChart2,
  PieChart as PieIcon,
  Activity,
} from "lucide-react";
import { dashboardRepository } from "@/lib/api/users";
import { StatCardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { cn, formatNumber } from "@/lib/utils";

const C = {
  green: "#16a34a",
  greenL: "#4ade80",
  sky: "#0ea5e9",
  amber: "#f59e0b",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  slate: "#94a3b8",
};

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: C.sky,
  UNDER_REVIEW: C.amber,
  APPROVED: C.green,
  REJECTED: C.rose,
};

const PROVINCE_COLORS = [C.green, C.sky, C.amber, C.violet, C.rose];
const AGE_COLORS = [C.green, C.sky, C.amber, C.rose];
const GENDER_COLORS = [C.sky, C.green];

const TT_STYLE = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,.1)",
  fontSize: "12px",
};

function ChartCard({
  title,
  icon,
  subtitle,
  children,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card p-6", className)}>
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-green-600">{icon}</span>
        <div>
          <h3 className="font-display font-semibold text-surface-900 text-sm">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  sub,
  icon,
  bg,
  border,
  trend,
  trendUp,
  delay = 0,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        "card p-5 border-t-4 animate-slide-up hover:-translate-y-0.5 transition-all duration-300",
        border,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
          {title}
        </p>
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
            bg,
          )}
        >
          {icon}
        </div>
      </div>
      <p className="font-display text-3xl font-bold text-surface-900">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
      {sub && <p className="text-xs text-surface-400 mt-1">{sub}</p>}
      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 mt-2 text-xs font-medium",
            trendUp ? "text-green-600" : "text-rose-500",
          )}
        >
          <TrendingUp className={cn("w-3 h-3", !trendUp && "rotate-180")} />
          {trend}
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="font-display font-bold text-surface-900">{title}</h2>
        <p className="text-xs text-surface-400">{description}</p>
      </div>
    </div>
  );
}

function LegendRow({
  label,
  value,
  color,
  total,
}: {
  label: string;
  value: number;
  color: string;
  total: number;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <span className="text-xs text-surface-600 flex-1 truncate">{label}</span>
      <span className="text-xs font-bold text-surface-900">{value}</span>
      <span className="text-xs text-surface-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: s, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardRepository.getStats,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6">
              <Skeleton className="h-4 w-32 mb-6" />
              <Skeleton className="h-52 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!s) return null;

  const byStatus = s.applicationsByStatus ?? [];
  const byMonth = s.applicationsByMonth ?? [];
  const byProvince = s.applicationsByProvince ?? [];
  const ageGroups = s.ageGroups ?? [];
  const genderBreakdown = s.genderBreakdown ?? [];
  const divisionBreakdown = s.divisionBreakdown ?? [];
  const topPositions = s.topPositions ?? [];
  const statusTotal = byStatus.reduce((a, b) => a + b.count, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="page-header">
        <h1 className="page-title">Analytics Overview</h1>
        <p className="page-subtitle">
          Comprehensive statistics and real-time data visualization
        </p>
      </div>

      <section className="space-y-4">
        <SectionHeader
          icon={<Activity className="w-4 h-4" />}
          title="Key Metrics"
          description="Top-level system health at a glance"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value={s.totalApplications}
            sub="All time submissions"
            icon={<FileText className="w-4 h-4 text-green-600" />}
            bg="bg-green-50"
            border="border-t-green-500"
            delay={0}
          />
          <StatCard
            title="Under Review"
            value={s.underReview}
            sub="Awaiting HR decision"
            icon={<Clock className="w-4 h-4 text-amber-600" />}
            bg="bg-amber-50"
            border="border-t-amber-400"
            delay={60}
          />
          <StatCard
            title="Approved"
            value={s.approved}
            sub="Successful applications"
            icon={<CheckCircle2 className="w-4 h-4 text-green-700" />}
            bg="bg-green-100"
            border="border-t-green-600"
            delay={120}
          />
          <StatCard
            title="Rejected"
            value={s.rejected}
            sub="Did not meet criteria"
            icon={<XCircle className="w-4 h-4 text-rose-600" />}
            bg="bg-rose-50"
            border="border-t-rose-500"
            delay={180}
          />
          <StatCard
            title="Total Users"
            value={s.totalUsers}
            sub="All system accounts"
            icon={<Users className="w-4 h-4 text-sky-600" />}
            bg="bg-sky-50"
            border="border-t-sky-500"
            delay={240}
          />
          <StatCard
            title="Active Users"
            value={s.activeUsers}
            sub="Accounts in good standing"
            icon={<UserCheck className="w-4 h-4 text-green-600" />}
            bg="bg-green-50"
            border="border-t-green-400"
            delay={300}
          />
          <StatCard
            title="HR Managers"
            value={s.totalHR}
            sub="Review team members"
            icon={<Award className="w-4 h-4 text-violet-600" />}
            bg="bg-violet-50"
            border="border-t-violet-400"
            delay={360}
          />
          <StatCard
            title="Approval Rate"
            value={`${s.approvalRate}%`}
            sub="Of reviewed applications"
            icon={<Target className="w-4 h-4 text-green-700" />}
            bg="bg-green-50"
            border="border-t-green-500"
            delay={420}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          icon={<BarChart2 className="w-4 h-4" />}
          title="Application Analytics"
          description="Trends, status breakdown and geographic distribution"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Applications Over Time"
            icon={<Activity className="w-4 h-4" />}
            subtitle="Monthly submission trend"
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={byMonth}
                margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
              >
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.green} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: C.slate }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: C.slate }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={TT_STYLE} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Applications"
                  stroke={C.green}
                  strokeWidth={2.5}
                  fill="url(#g1)"
                  dot={{ fill: C.green, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="By Status"
            icon={<PieIcon className="w-4 h-4" />}
            subtitle="Current pipeline distribution"
          >
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={byStatus.map((i) => ({
                    name: i.status,
                    value: i.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {byStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? C.slate}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={TT_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-0.5 mt-2">
              {byStatus.map((e) => (
                <LegendRow
                  key={e.status}
                  label={e.status.replace("_", " ")}
                  value={e.count}
                  color={STATUS_COLORS[e.status] ?? C.slate}
                  total={statusTotal}
                />
              ))}
            </div>
          </ChartCard>

          {byProvince.length > 0 && (
            <ChartCard
              title="By Province"
              icon={<BarChart2 className="w-4 h-4" />}
              subtitle="Geographic spread of applicants"
              className="lg:col-span-3"
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={byProvince}
                  margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="province"
                    tick={{ fontSize: 11, fill: C.slate }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: C.slate }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={TT_STYLE} />
                  <Bar
                    dataKey="count"
                    name="Applications"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={52}
                  >
                    {byProvince.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PROVINCE_COLORS[i % PROVINCE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      </section>

      {(ageGroups.length > 0 ||
        genderBreakdown.length > 0 ||
        divisionBreakdown.length > 0) && (
        <section className="space-y-4">
          <SectionHeader
            icon={<PieIcon className="w-4 h-4" />}
            title="Applicant Demographics"
            description="Age groups, gender distribution and academic performance"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ageGroups.length > 0 && (
              <ChartCard
                title="Age Groups"
                icon={<Users className="w-4 h-4" />}
                subtitle="Applicant age distribution"
              >
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={ageGroups}
                    margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="group"
                      tick={{ fontSize: 11, fill: C.slate }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: C.slate }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={TT_STYLE} />
                    <Bar
                      dataKey="count"
                      name="Applicants"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                    >
                      {ageGroups.map((_, i) => (
                        <Cell
                          key={i}
                          fill={AGE_COLORS[i % AGE_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {genderBreakdown.length > 0 && (
              <ChartCard
                title="Gender Breakdown"
                icon={<Users className="w-4 h-4" />}
                subtitle="Male vs Female applicants"
              >
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={genderBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="gender"
                    >
                      {genderBreakdown.map((_, i) => (
                        <Cell
                          key={i}
                          fill={GENDER_COLORS[i % GENDER_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TT_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-0.5 mt-2">
                  {genderBreakdown.map((g, i) => (
                    <LegendRow
                      key={g.gender}
                      label={g.gender}
                      value={g.count}
                      color={GENDER_COLORS[i % GENDER_COLORS.length]}
                      total={s.totalApplicants}
                    />
                  ))}
                </div>
              </ChartCard>
            )}

            {divisionBreakdown.length > 0 && (
              <ChartCard
                title="Academic Division"
                icon={<Award className="w-4 h-4" />}
                subtitle="Division I vs II distribution"
              >
                <div className="space-y-4 mt-2">
                  {divisionBreakdown.map((d) => {
                    const pct =
                      s.totalApplications > 0
                        ? Math.round((d.count / s.totalApplications) * 100)
                        : 0;
                    const isDiv1 = d.division === "Division I";
                    return (
                      <div key={d.division}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span
                            className={cn(
                              "font-semibold",
                              isDiv1 ? "text-green-700" : "text-amber-700",
                            )}
                          >
                            {d.division}
                          </span>
                          <span className="text-surface-500">
                            {d.count} applicants ({pct}%)
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-surface-100 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700",
                              isDiv1 ? "bg-green-500" : "bg-amber-400",
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 pt-4 border-t border-surface-100 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-center">
                    <p className="text-xs text-green-600 mb-1">
                      Avg pts — Approved
                    </p>
                    <p className="font-display text-2xl font-bold text-green-700">
                      {s.avgPointsApproved}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-center">
                    <p className="text-xs text-rose-600 mb-1">
                      Avg pts — Rejected
                    </p>
                    <p className="font-display text-2xl font-bold text-rose-700">
                      {s.avgPointsRejected}
                    </p>
                  </div>
                </div>
              </ChartCard>
            )}
          </div>
        </section>
      )}

      {topPositions.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            icon={<Target className="w-4 h-4" />}
            title="Most Applied Positions"
            description="Career roles ranked by application volume"
          />
          <ChartCard
            title="Top Positions"
            icon={<BarChart2 className="w-4 h-4" />}
            subtitle="Number of applications received per role"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {topPositions.slice(0, 8).map((p) => {
                  const maxCount = topPositions[0]?.count ?? 1;
                  const pct = Math.round((p.count / maxCount) * 100);
                  return (
                    <div key={p.position}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-surface-700 truncate max-w-[200px]">
                          {p.position}
                        </span>
                        <span className="font-bold text-surface-900 ml-2 flex-shrink-0">
                          {p.count}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={topPositions.slice(0, 6).map((p) => ({
                    ...p,
                    position:
                      p.position.length > 18
                        ? p.position.slice(0, 16) + "…"
                        : p.position,
                  }))}
                  layout="vertical"
                  margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: C.slate }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="position"
                    width={120}
                    tick={{ fontSize: 10, fill: C.slate }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={TT_STYLE} />
                  <Bar
                    dataKey="count"
                    name="Applications"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={24}
                    fill={C.green}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>
      )}

      <section className="space-y-4">
        <SectionHeader
          icon={<Shield className="w-4 h-4" />}
          title="User System Overview"
          description="Breakdown of accounts by role and activity status"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ChartCard
            title="Users by Role"
            icon={<Shield className="w-4 h-4" />}
            subtitle="Account role distribution"
            className="sm:col-span-2"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width={200} height={180}>
                <RadialBarChart
                  innerRadius="30%"
                  outerRadius="90%"
                  data={[
                    {
                      name: "Applicants",
                      value: s.totalApplicants,
                      fill: C.green,
                    },
                    { name: "HR", value: s.totalHR, fill: C.sky },
                    { name: "Admins", value: s.totalAdmins, fill: C.amber },
                  ]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar dataKey="value" cornerRadius={4} />
                  <Tooltip contentStyle={TT_STYLE} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {[
                  {
                    label: "Applicants",
                    value: s.totalApplicants,
                    color: C.green,
                    bg: "bg-green-50 text-green-800",
                  },
                  {
                    label: "HR Managers",
                    value: s.totalHR,
                    color: C.sky,
                    bg: "bg-sky-50 text-sky-800",
                  },
                  {
                    label: "Super Admins",
                    value: s.totalAdmins,
                    color: C.amber,
                    bg: "bg-amber-50 text-amber-800",
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl",
                      r.bg,
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: r.color }}
                      />
                      <span className="text-sm font-medium">{r.label}</span>
                    </div>
                    <span className="text-xl font-display font-bold">
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Active vs Inactive"
            icon={<UserCheck className="w-4 h-4" />}
            subtitle="Account status overview"
          >
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Active", value: s.activeUsers },
                    { name: "Inactive", value: s.totalUsers - s.activeUsers },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill={C.green} />
                  <Cell fill={C.slate} />
                </Pie>
                <Tooltip contentStyle={TT_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-0.5 mt-2">
              <LegendRow
                label="Active"
                value={s.activeUsers}
                color={C.green}
                total={s.totalUsers}
              />
              <LegendRow
                label="Inactive"
                value={s.totalUsers - s.activeUsers}
                color={C.slate}
                total={s.totalUsers}
              />
            </div>
          </ChartCard>
        </div>
      </section>
    </div>
  );
}
