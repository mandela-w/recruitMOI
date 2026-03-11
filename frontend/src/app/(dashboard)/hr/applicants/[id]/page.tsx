"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Briefcase,
  Phone,
  Mail,
  Award,
  GraduationCap,
} from "lucide-react";
import { applicationRepository } from "@/lib/api/applications";
import {
  ApplicantAvatar,
  DetailSection,
  DetailRow,
  ReviewModal,
  DecisionBanner,
} from "@/components/hr";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { formatDate, cn } from "@/lib/utils";
import type { ReviewFormData } from "@/lib/validators/schemas";

type ReviewAction = "APPROVED" | "REJECTED";

const REVIEW_ACTIONS: {
  action: ReviewAction;
  label: string;
  variant: "primary" | "danger";
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    action: "APPROVED",
    label: "Approve",
    variant: "primary",
    icon: <CheckCircle className="w-4 h-4" />,
    description: "Applicant meets requirements",
  },
  {
    action: "REJECTED",
    label: "Reject",
    variant: "danger",
    icon: <XCircle className="w-4 h-4" />,
    description: "Does not meet requirements",
  },
];

function ApplicantDetailContent() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [activeAction, setActiveAction] = useState<ReviewAction | null>(null);

  const { data: application, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationRepository.getById(id),
  });

  const reviewMutation = useMutation({
    mutationFn: (data: ReviewFormData) =>
      applicationRepository.review(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications-recent"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      setActiveAction(null);
      success(
        updated.status === "APPROVED"
          ? "Application Approved ✓"
          : "Application Rejected",
        `Decision recorded for ${updated.firstName} ${updated.lastName}`,
      );
    },
    onError: (err: { message?: string }) => {
      toastError(
        "Review Failed",
        err.message ?? "An unexpected error occurred. Please try again.",
      );
    },
  });

  const handleReviewSubmit = (data: ReviewFormData) => {
    reviewMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-36" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 space-y-4">
                <Skeleton className="h-5 w-40" />
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!application) return null;

  const canReview =
    application.status === "SUBMITTED" || application.status === "UNDER_REVIEW";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <Link href="/hr/applicants">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            All Applicants
          </Button>
        </Link>
      </div>

      {/*Applicant hero header */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          <ApplicantAvatar
            firstName={application.firstName}
            lastName={application.lastName}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="font-display text-2xl font-bold text-surface-900">
                {application.firstName} {application.lastName}
              </h1>
              <StatusBadge status={application.status} />
            </div>
            <p className="text-surface-500 flex items-center gap-1.5 text-sm">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              {application.positionAppliedFor}
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-surface-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {application.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {application.phoneNumber}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Applied{" "}
                {formatDate(application.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DecisionBanner application={application} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — all detail sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <DetailSection
            title="Personal Information"
            icon={<User className="w-4 h-4" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <DetailRow
                label="Full Name"
                value={`${application.firstName} ${application.lastName}`}
                icon={<User className="w-3.5 h-3.5" />}
              />
              <DetailRow label="NID Number" value={application.nid} />
              <DetailRow
                label="Date of Birth"
                value={formatDate(application.dateOfBirth)}
              />
              <DetailRow label="Gender" value={application.gender} />
              <DetailRow label="Nationality" value={application.nationality} />
              <DetailRow
                label="Phone"
                value={application.phoneNumber}
                icon={<Phone className="w-3.5 h-3.5" />}
              />
              <DetailRow
                label="Email"
                value={application.email}
                icon={<Mail className="w-3.5 h-3.5" />}
              />
            </div>
          </DetailSection>

          {/* Location */}
          <DetailSection title="Location" icon={<MapPin className="w-4 h-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <DetailRow label="Province" value={application.province} />
              <DetailRow label="District" value={application.district} />
              <DetailRow
                label="Address"
                value={application.address}
                multiline
              />
            </div>
          </DetailSection>

          {/* Academic Background */}
          <DetailSection
            title="Academic Background"
            icon={<BookOpen className="w-4 h-4" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <DetailRow
                label="School"
                value={application.schoolName}
                multiline
              />
              <DetailRow
                label="Combination"
                value={application.combinationName}
                multiline
              />
              <DetailRow
                label="Year Completed"
                value={String(application.yearOfCompletion)}
              />
              <DetailRow
                label="NESA Index No."
                value={application.nesaIndexNumber}
              />
              <DetailRow
                label="Division"
                value={application.division}
                icon={<Award className="w-3.5 h-3.5" />}
                highlight
              />
              <DetailRow
                label="Total Points"
                value={`${application.totalPoints} pts`}
                icon={<GraduationCap className="w-3.5 h-3.5" />}
                highlight
              />
            </div>
          </DetailSection>

          {/* Cover Letter */}
          <DetailSection
            title="Cover Letter"
            icon={<FileText className="w-4 h-4" />}
          >
            <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">
              {application.coverLetter}
            </p>
          </DetailSection>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Review actions — only when pending */}
          {canReview && (
            <div className="card p-6">
              <p className="font-display font-semibold text-surface-900 mb-1 text-sm uppercase tracking-wide">
                Review Application
              </p>
              <p className="text-xs text-surface-400 mb-5">
                Your decision will be recorded and communicated to the
                applicant.
              </p>
              <div className="space-y-3">
                {REVIEW_ACTIONS.map(
                  ({ action, label, variant, icon, description }) => (
                    <button
                      key={action}
                      onClick={() => setActiveAction(action)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left",
                        "hover:shadow-md active:scale-[0.98]",
                        action === "APPROVED"
                          ? "border-green-200 hover:border-green-400 hover:bg-green-50"
                          : "border-rose-200 hover:border-rose-400 hover:bg-rose-50",
                      )}
                    >
                      <span
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                          action === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-rose-100 text-rose-600",
                        )}
                      >
                        {icon}
                      </span>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            action === "APPROVED"
                              ? "text-green-800"
                              : "text-rose-700",
                          )}
                        >
                          {label}
                        </p>
                        <p className="text-xs text-surface-400">
                          {description}
                        </p>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* CV download */}
          {application.cvUrl && (
            <div className="card p-6">
              <p className="font-display font-semibold text-surface-900 mb-4 text-sm uppercase tracking-wide">
                CV Document
              </p>
              {application.cvFileName && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 mb-3">
                  <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-green-800 truncate flex-1">
                    {application.cvFileName}
                  </span>
                </div>
              )}
              <a
                href={application.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="secondary"
                  className="w-full"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download CV
                </Button>
              </a>
            </div>
          )}

          {/* Timeline */}
          <div className="card p-6">
            <p className="font-display font-semibold text-surface-900 mb-4 text-sm uppercase tracking-wide">
              Timeline
            </p>
            <ol className="space-y-4">
              <TimelineItem
                icon={<Clock className="w-4 h-4" />}
                label="Submitted"
                date={formatDate(application.createdAt)}
                color="text-sky-500"
              />
              {application.status === "UNDER_REVIEW" && (
                <TimelineItem
                  icon={<Clock className="w-4 h-4" />}
                  label="Under Review"
                  date={formatDate(application.updatedAt)}
                  color="text-amber-500"
                />
              )}
              {application.reviewedAt && (
                <TimelineItem
                  icon={
                    application.status === "APPROVED" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )
                  }
                  label={
                    application.status === "APPROVED" ? "Approved" : "Rejected"
                  }
                  date={formatDate(application.reviewedAt)}
                  color={
                    application.status === "APPROVED"
                      ? "text-green-600"
                      : "text-rose-500"
                  }
                />
              )}
            </ol>
          </div>
        </div>
      </div>

      {/* ── Review modal*/}
      <ReviewModal
        application={application}
        action={activeAction}
        isOpen={!!activeAction}
        isSubmitting={reviewMutation.isPending}
        onClose={() => setActiveAction(null)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}

function TimelineItem({
  icon,
  label,
  date,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  date: string;
  color: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className={cn("mt-0.5 flex-shrink-0", color)}>{icon}</span>
      <div>
        <p className="text-xs text-surface-400">{label}</p>
        <p className="text-sm font-medium text-surface-900">{date}</p>
      </div>
    </li>
  );
}

export default function ApplicantDetailPage() {
  return (
    <ToastProvider>
      <ApplicantDetailContent />
    </ToastProvider>
  );
}
