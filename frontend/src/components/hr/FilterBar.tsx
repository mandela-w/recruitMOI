"use client";

import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { ApplicationStatus } from "@/types";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

interface FilterBarProps {
  search: string;
  statusFilter: ApplicationStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ApplicationStatus | "") => void;
  onClear: () => void;
  resultCount?: number;
  totalCount?: number;
}

export function FilterBar({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onClear,
  resultCount,
  totalCount,
}: FilterBarProps) {
  const isDirty = search !== "" || statusFilter !== "";

  return (
    <div className="card p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Search by name, email or position..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Status filter */}
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as ApplicationStatus | "")
            }
            options={STATUS_OPTIONS}
            leftIcon={<Filter className="w-4 h-4" />}
          />
        </div>

        {/* Clear button — only shown when filters are active */}
        {isDirty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            leftIcon={<X className="w-4 h-4" />}
            className="self-stretch sm:self-auto"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Result summary */}
      {typeof resultCount === "number" && typeof totalCount === "number" && (
        <p className="text-xs text-surface-400">
          Showing{" "}
          <span className="font-semibold text-surface-700">{resultCount}</span>{" "}
          of{" "}
          <span className="font-semibold text-surface-700">{totalCount}</span>{" "}
          applicants
          {isDirty && " (filtered)"}
        </p>
      )}
    </div>
  );
}
