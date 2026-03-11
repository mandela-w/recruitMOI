import {
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { cn, formatDateTime } from "@/lib/utils";
import type { Application } from "@/types";

interface DecisionBannerProps {
  application: Application;
}

export function DecisionBanner({ application }: DecisionBannerProps) {
  if (application.status !== "APPROVED" && application.status !== "REJECTED") {
    return null;
  }

  const isApproved = application.status === "APPROVED";

  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-6",
        isApproved
          ? "bg-green-50/60 border-green-200"
          : "bg-rose-50/60 border-rose-200",
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            isApproved ? "bg-green-100" : "bg-rose-100",
          )}
        >
          {isApproved ? (
            <CheckCircle2 className="w-5 h-5 text-green-700" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600" />
          )}
        </div>
        <div className="flex-1">
          <p
            className={cn(
              "font-display font-bold",
              isApproved ? "text-green-800" : "text-rose-800",
            )}
          >
            {isApproved ? "Application Approved" : "Application Rejected"}
          </p>
          <p className="text-xs text-surface-500 mt-0.5">
            Decision recorded — visible to applicant
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {application.reviewerName && (
          <MetaCell
            icon={<User className="w-4 h-4" />}
            label="Reviewed by"
            value={application.reviewerName}
            sub="HR Manager"
          />
        )}
        {application.reviewedAt && (
          <MetaCell
            icon={<Calendar className="w-4 h-4" />}
            label="Decision date"
            value={formatDateTime(application.reviewedAt)}
          />
        )}
      </div>

      {/* HR message */}
      {application.reviewReason && (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            HR Message to Applicant
          </p>
          <blockquote
            className={cn(
              "p-4 rounded-xl border text-sm leading-relaxed italic",
              isApproved
                ? "bg-white border-green-200 text-green-900"
                : "bg-white border-rose-200 text-rose-900",
            )}
          >
            &ldquo;{application.reviewReason}&rdquo;
          </blockquote>
        </div>
      )}
    </div>
  );
}

function MetaCell({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-surface-100">
      <span className="text-surface-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-surface-400">{label}</p>
        <p className="text-sm font-semibold text-surface-900">{value}</p>
        {sub && <p className="text-xs text-surface-400">{sub}</p>}
      </div>
    </div>
  );
}
