"use client";

import Link from "next/link";
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ApplicantAvatar } from "./ApplicantAvatar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { formatDate, cn } from "@/lib/utils";
import type { Application } from "@/types";

export type SortOrder = "asc" | "desc";

interface ApplicantTableProps {
  applications: Application[];
  isLoading: boolean;
  sortOrder: SortOrder;
  onSortToggle: () => void;
  detailBasePath?: string;
}

export function ApplicantTable({
  applications,
  isLoading,
  sortOrder,
  onSortToggle,
  detailBasePath = "/hr/applicants",
}: ApplicantTableProps) {
  const isAsc = sortOrder === "asc";

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-surface-100 bg-surface-50/40">
        <p className="text-xs text-surface-500">
          Sorted by surname{" "}
          <span className="font-semibold text-surface-700">
            {isAsc ? "A → Z" : "Z → A"}
          </span>
        </p>

        <button
          onClick={onSortToggle}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold",
            "transition-all duration-150 select-none",
            isAsc
              ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
              : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
          )}
          title={
            isAsc
              ? "Currently A→Z — click for Z→A"
              : "Currently Z→A — click for A→Z"
          }
        >
          {isAsc ? (
            <>
              <ArrowUp className="w-3.5 h-3.5" /> Sort Z → A
            </>
          ) : (
            <>
              <ArrowDown className="w-3.5 h-3.5" /> Sort A → Z
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-100 bg-surface-50/30">
              {[
                { label: "Applicant", cls: "" },
                { label: "Position", cls: "hidden md:table-cell" },
                { label: "Province", cls: "hidden lg:table-cell" },
                { label: "Division", cls: "hidden lg:table-cell" },
                { label: "Status", cls: "" },
                { label: "Applied", cls: "hidden sm:table-cell" },
                { label: "", cls: "text-right" },
              ].map((col) => (
                <th
                  key={col.label}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider",
                    col.cls,
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-50">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={7} />
              ))
            ) : applications.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-16 text-surface-400 text-sm"
                >
                  No applicants found matching your criteria.
                </td>
              </tr>
            ) : (
              applications.map((app, i) => (
                <ApplicantRow
                  key={app.id}
                  application={app}
                  index={i}
                  detailBasePath={detailBasePath}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ApplicantRowProps {
  application: Application;
  index: number;
  detailBasePath: string;
}

function ApplicantRow({
  application: app,
  index,
  detailBasePath,
}: ApplicantRowProps) {
  return (
    <tr
      className="hover:bg-surface-50/60 transition-colors animate-fade-in group"
      style={{ animationDelay: `${index * 25}ms` }}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <ApplicantAvatar
            firstName={app.firstName}
            lastName={app.lastName}
            size="sm"
          />
          <div>
            <p className="text-sm font-semibold text-surface-900 group-hover:text-green-700 transition-colors">
              {app.lastName}, {app.firstName}
            </p>
            <p className="text-xs text-surface-400">{app.email}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 hidden md:table-cell">
        <p className="text-sm text-surface-700 max-w-[180px] truncate">
          {app.positionAppliedFor}
        </p>
      </td>

      <td className="px-6 py-4 hidden lg:table-cell">
        <p className="text-sm text-surface-600">{app.province}</p>
      </td>

      <td className="px-6 py-4 hidden lg:table-cell">
        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-lg",
            app.division === "Division I"
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700",
          )}
        >
          {app.division}
        </span>
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={app.status} />
      </td>

      <td className="px-6 py-4 hidden sm:table-cell">
        <p className="text-xs text-surface-500">{formatDate(app.createdAt)}</p>
      </td>

      <td className="px-6 py-4 text-right">
        <Link href={`${detailBasePath}/${app.id}`}>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Review
          </Button>
        </Link>
      </td>
    </tr>
  );
}
