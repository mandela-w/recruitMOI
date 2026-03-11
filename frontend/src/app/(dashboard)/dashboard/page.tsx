import type { Metadata } from "next";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import {
  ApplicationsChart,
  ProvinceChart,
} from "@/components/dashboard/Charts";
import { RecentApplicationsTable } from "@/components/applicants/RecentApplicationsTable";

export const metadata: Metadata = { title: "Analytics" };

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">
          Overview of recruitment activity and key metrics
        </p>
      </div>

      <DashboardStats />

      <ApplicationsChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentApplicationsTable />
        </div>
        <div>
          <ProvinceChart />
        </div>
      </div>
    </div>
  );
}
