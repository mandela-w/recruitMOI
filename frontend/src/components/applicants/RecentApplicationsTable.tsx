"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { applicationRepository } from "@/lib/api/applications";
import { StatusBadge } from "@/components/ui/Badge";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { formatDate, getInitials } from "@/lib/utils";

export function RecentApplicationsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["applications-recent"],
    queryFn: () => applicationRepository.getLatest({ pageSize: 10 }),
  });

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-surface-100">
        <h3 className="font-display font-semibold text-surface-900">
          Recent Applications
        </h3>
        <Link
          href="/hr/applicants"
          className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 hover:underline"
        >
          View all <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-100 bg-surface-50/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Position
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={4} />
                ))
              : data?.data.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-surface-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ...
 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        >
                          {getInitials(app.firstName, app.lastName)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-surface-900">
                            {app.firstName} {app.lastName}
                          </p>
                          <p className="text-xs text-surface-400">
                            {app.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-surface-700 truncate max-w-[180px]">
                        {app.positionAppliedFor}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-surface-500">
                        {formatDate(app.createdAt)}
                      </p>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!isLoading && !data?.data.length && (
          <div className="text-center py-12 text-surface-400">
            <p className="text-sm">No applications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
