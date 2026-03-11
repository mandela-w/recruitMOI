"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { applicationRepository } from "@/lib/api/applications";
import { FilterBar } from "@/components/hr/FilterBar";
import { ApplicantTable, type SortOrder } from "@/components/hr/ApplicantTable";
import { Button } from "@/components/ui/Button";
import type { ApplicationStatus } from "@/types";

const PAGE_SIZE = 10;

export default function HRApplicantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleStatusChange = (v: ApplicationStatus | "") => {
    setStatusFilter(v);
    setPage(1);
  };
  const handleClear = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      "applications",
      { search, status: statusFilter, page, sortOrder },
    ],
    queryFn: () =>
      applicationRepository.getLatest({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        pageSize: PAGE_SIZE,
        sortBy: "lastName",
        sortOrder,
      }),
    placeholderData: (prev) => prev,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="page-title">Applicants</h1>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onClear={handleClear}
        resultCount={data?.data.length}
        totalCount={data?.total}
      />

      {/* Table */}
      <ApplicantTable
        applications={data?.data ?? []}
        isLoading={isLoading}
        sortOrder={sortOrder}
        onSortToggle={handleSortToggle}
        detailBasePath="/hr/applicants"
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="card p-4 flex items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            Showing{" "}
            <span className="font-semibold text-surface-700">
              {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, data.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-surface-700">{data.total}</span>{" "}
            applicants
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Prev
            </Button>
            <span className="text-sm font-medium text-surface-700 px-2">
              {page} / {data.totalPages}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
