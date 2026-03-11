"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  BookOpen,
  MessageSquare,
  Plus,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Download,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from "lucide-react";
import {
  applicationRepository,
  getDemoStatus,
  setDemoStatus,
} from "@/lib/api/applications";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate, cn } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types";

// ── Timeline steps ────────────────────────────────────────────
const STEPS: {
  status: ApplicationStatus;
  label: string;
  description: string;
}[] = [
  {
    status: "SUBMITTED",
    label: "Submitted",
    description: "Application received",
  },
  {
    status: "UNDER_REVIEW",
    label: "Under Review",
    description: "Being reviewed by HR",
  },
  { status: "APPROVED", label: "Decision", description: "Final decision made" },
];
const STATUS_ORDER: ApplicationStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
];

// ── Demo switcher (development only) ─────────────────────────
const DEMO_STATUSES: { label: string; value: string; color: string }[] = [
  {
    label: "Under Review",
    value: "UNDER_REVIEW",
    color: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
  },
  {
    label: "Approved",
    value: "APPROVED",
    color: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  },
  {
    label: "Rejected",
    value: "REJECTED",
    color: "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200",
  },
];

function DemoSwitcher({
  current,
  onChange,
}: {
  current: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-50 border border-surface-200 border-dashed">
      <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider mr-1">
        Demo:
      </span>
      {DEMO_STATUSES.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={cn(
            "text-xs px-3 py-1.5 rounded-lg border font-medium transition-all",
            current === s.value
              ? s.color + " ring-2 ring-offset-1 ring-current"
              : "bg-white border-surface-200 text-surface-500 hover:bg-surface-100",
          )}
        >
          {s.label}
        </button>
      ))}
      <span className="text-[10px] text-surface-300 ml-auto">
        Switch to test different states
      </span>
    </div>
  );
}

// ── Horizontal Progress Timeline ──────────────────────────────
function HorizontalTimeline({ application }: { application: Application }) {
  const isRejected = application.status === "REJECTED";
  const currentIndex = STATUS_ORDER.indexOf(
    isRejected ? "APPROVED" : application.status,
  );
  const progressPct = isRejected
    ? 100
    : currentIndex === 0
      ? 0
      : currentIndex === 1
        ? 50
        : 100;

  return (
    <div className="card p-6">
      <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-8">
        Application Progress
      </p>
      <div className="relative flex items-start justify-between">
        {/* Grey track */}
        <div className="absolute left-5 right-5 top-5 h-0.5 bg-surface-100 z-0" />
        {/* Green progress track */}
        <div
          className="absolute left-5 top-5 h-0.5 bg-green-500 z-0 transition-all duration-700"
          style={{
            width: `calc(${progressPct}% - ${
              progressPct === 100
                ? "2.5rem"
                : progressPct === 50
                  ? "1.25rem"
                  : "0rem"
            })`,
          }}
        />

        {STEPS.map((step, index) => {
          const isComplete = isRejected ? index < 2 : index < currentIndex;
          const isActive = !isRejected && step.status === application.status;
          const isRejectedStep = isRejected && index === 2;

          return (
            <div
              key={step.status}
              className="relative z-10 flex flex-col items-center gap-3 flex-1"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  isRejectedStep
                    ? "border-rose-400 bg-rose-50"
                    : isComplete
                      ? "border-green-600 bg-green-600"
                      : isActive
                        ? "border-green-600 bg-white ring-4 ring-green-100 animate-pulse-slow"
                        : "border-surface-200 bg-white",
                )}
              >
                {isRejectedStep ? (
                  <XCircle className="w-5 h-5 text-rose-500" />
                ) : isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : isActive ? (
                  <Clock className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-surface-200" />
                )}
              </div>
              <div className="text-center px-1">
                <p
                  className={cn(
                    "text-xs font-bold",
                    isRejectedStep
                      ? "text-rose-600"
                      : isComplete || isActive
                        ? "text-green-700"
                        : "text-surface-400",
                  )}
                >
                  {isRejectedStep ? "Rejected" : step.label}
                </p>
                <p className="text-[10px] text-surface-400 mt-0.5 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status message banner */}
      <div
        className={cn(
          "mt-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2",
          application.status === "APPROVED"
            ? "bg-green-50 text-green-800 border border-green-200"
            : application.status === "REJECTED"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : application.status === "UNDER_REVIEW"
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-sky-50 text-sky-800 border border-sky-200",
        )}
      >
        <span className="text-base">
          {application.status === "APPROVED"
            ? "🎉"
            : application.status === "REJECTED"
              ? "😔"
              : application.status === "UNDER_REVIEW"
                ? "🔍"
                : "📋"}
        </span>
        {application.status === "APPROVED" &&
          "Congratulations! Your application has been approved."}
        {application.status === "REJECTED" &&
          "Your application was not successful this time."}
        {application.status === "UNDER_REVIEW" &&
          "HR is currently reviewing your application. You will be notified soon."}
        {application.status === "SUBMITTED" &&
          "Your application has been received and is queued for review."}
      </div>
    </div>
  );
}

// ── HR Decision Panel (shown when APPROVED or REJECTED) ───────
function HRDecisionPanel({ application }: { application: Application }) {
  if (application.status !== "APPROVED" && application.status !== "REJECTED")
    return null;

  const isApproved = application.status === "APPROVED";

  return (
    <div
      className={cn(
        "card p-6 border-2",
        isApproved
          ? "border-green-200 bg-green-50/40"
          : "border-rose-200 bg-rose-50/40",
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
            isApproved ? "bg-green-100" : "bg-rose-100",
          )}
        >
          {isApproved ? (
            <ThumbsUp className="w-5 h-5 text-green-700" />
          ) : (
            <ThumbsDown className="w-5 h-5 text-rose-700" />
          )}
        </div>
        <div>
          <h3
            className={cn(
              "font-display font-bold text-base",
              isApproved ? "text-green-800" : "text-rose-800",
            )}
          >
            {isApproved ? "Application Approved" : "Application Not Successful"}
          </h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Official response from the recruitment team
          </p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={application.status} />
        </div>
      </div>

      {/* Decision details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {application.reviewedAt && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-surface-100">
            <Calendar className="w-4 h-4 text-surface-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-surface-400">Decision Date</p>
              <p className="text-sm font-semibold text-surface-900">
                {formatDate(application.reviewedAt)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* HR comment / reason */}
      {application.reviewReason && (
        <div>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Message from HR
          </p>
          <div
            className={cn(
              "p-4 rounded-xl border text-sm leading-relaxed",
              isApproved
                ? "bg-white border-green-200 text-green-900"
                : "bg-white border-rose-200 text-rose-900",
            )}
          >
            <p className="italic">&ldquo;{application.reviewReason}&rdquo;</p>
          </div>
        </div>
      )}

      {/* Next steps */}
      <div
        className={cn(
          "mt-4 p-3 rounded-xl text-xs font-medium flex items-start gap-2",
          isApproved
            ? "bg-green-100/60 text-green-800"
            : "bg-rose-100/60 text-rose-800",
        )}
      >
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        {isApproved
          ? "Our team will be in touch with further instructions regarding the next steps of the recruitment process. Please check your email regularly."
          : "Thank you for applying. We encourage you to continue developing your skills and consider re-applying for future openings that match your profile."}
      </div>
    </div>
  );
}

// ── Application Summary Card ──────────────────────────────────
function ApplicationCard({
  application,
  onViewDetails,
}: {
  application: Application;
  onViewDetails: () => void;
}) {
  return (
    <div
      className={cn(
        "card p-6 border-l-4",
        application.status === "APPROVED"
          ? "border-l-green-600"
          : application.status === "REJECTED"
            ? "border-l-rose-500"
            : application.status === "UNDER_REVIEW"
              ? "border-l-amber-500"
              : "border-l-sky-400",
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display font-bold text-surface-900 text-lg">
              {application.firstName} {application.lastName}
            </h2>
            <StatusBadge status={application.status} />
          </div>
          <p className="text-surface-500 text-sm mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Submitted {formatDate(application.createdAt)}
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<Eye className="w-4 h-4" />}
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoTile
          icon={<Briefcase className="w-4 h-4" />}
          label="Position Applied For"
          value={application.positionAppliedFor}
        />
        <InfoTile
          icon={<GraduationCap className="w-4 h-4" />}
          label="School"
          value={application.schoolName}
        />
        <InfoTile
          icon={<Award className="w-4 h-4" />}
          label="Academic Result"
          value={`${application.totalPoints} pts — ${application.division}`}
        />
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-surface-100">
      <span className="text-green-600 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-surface-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-surface-800 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Application Details Modal ─────────────────────────────────
function ApplicationModal({
  application,
  onClose,
}: {
  application: Application;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-surface-900">
                Application Details
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={application.status} />
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Personal Info */}
          <ModalSection
            title="Personal Information"
            icon={<User className="w-4 h-4" />}
          >
            <div className="grid grid-cols-2 gap-4">
              <ModalField
                label="Full Name"
                value={`${application.firstName} ${application.lastName}`}
              />
              <ModalField label="NID Number" value={application.nid} />
              <ModalField
                label="Date of Birth"
                value={formatDate(application.dateOfBirth)}
              />
              <ModalField label="Gender" value={application.gender} />
              <ModalField
                label="Phone"
                value={application.phoneNumber}
                icon={<Phone className="w-3 h-3" />}
              />
              <ModalField
                label="Email"
                value={application.email}
                icon={<Mail className="w-3 h-3" />}
              />
              <ModalField
                label="Province / District"
                value={`${application.province} — ${application.district}`}
                icon={<MapPin className="w-3 h-3" />}
                className="col-span-2"
              />
            </div>
          </ModalSection>

          {/* Academic Info */}
          <ModalSection
            title="Academic Information"
            icon={<BookOpen className="w-4 h-4" />}
          >
            <div className="grid grid-cols-2 gap-4">
              <ModalField
                label="School"
                value={application.schoolName}
                className="col-span-2"
              />
              <ModalField
                label="Combination"
                value={application.combinationName}
                className="col-span-2"
              />
              <ModalField
                label="Year Completed"
                value={String(application.yearOfCompletion)}
              />
              <ModalField label="Division" value={application.division} />
              <ModalField
                label="Total Points"
                value={`${application.totalPoints} pts`}
              />
              <ModalField
                label="NESA Index"
                value={application.nesaIndexNumber}
              />
            </div>
          </ModalSection>

          {/* Application Details — CV + Cover Letter */}
          <ModalSection
            title="Application Details"
            icon={<Briefcase className="w-4 h-4" />}
          >
            <div className="space-y-4">
              <ModalField
                label="Position Applied For"
                value={application.positionAppliedFor}
              />

              {application.cvFileName && (
                <div>
                  <p className="text-xs text-surface-400 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> CV / Resume
                  </p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                    <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-green-800 flex-1 truncate">
                      {application.cvFileName}
                    </span>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-surface-400 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" /> Cover Letter
                </p>
                <div className="bg-surface-50 border border-surface-100 rounded-xl p-4">
                  <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">
                    {application.coverLetter || "No cover letter provided."}
                  </p>
                </div>
              </div>
            </div>
          </ModalSection>

          {/* HR Review (if decision made) */}
          {(application.status === "APPROVED" ||
            application.status === "REJECTED") &&
            application.reviewReason && (
              <ModalSection
                title="HR Decision"
                icon={
                  application.status === "APPROVED" ? (
                    <ThumbsUp className="w-4 h-4" />
                  ) : (
                    <ThumbsDown className="w-4 h-4" />
                  )
                }
                className={
                  application.status === "APPROVED"
                    ? "border-green-200"
                    : "border-rose-200"
                }
              >
                <div className="space-y-3">
                  {application.reviewedAt && (
                    <ModalField
                      label="Decision Date"
                      value={formatDate(application.reviewedAt)}
                    />
                  )}
                  <div>
                    <p className="text-xs text-surface-400 mb-1">HR Message</p>
                    <p
                      className={cn(
                        "text-sm font-medium p-3 rounded-xl italic",
                        application.status === "APPROVED"
                          ? "text-green-800 bg-green-50 border border-green-100"
                          : "text-rose-800 bg-rose-50 border border-rose-100",
                      )}
                    >
                      &ldquo;{application.reviewReason}&rdquo;
                    </p>
                  </div>
                </div>
              </ModalSection>
            )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-surface-100 px-6 py-4 rounded-b-2xl flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function ModalSection({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-100 overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-surface-50 border-b border-surface-100">
        <span className="text-green-600">{icon}</span>
        <p className="text-sm font-semibold text-surface-700">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ModalField({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-surface-400 mb-0.5 flex items-center gap-1">
        {icon && <span className="text-surface-300">{icon}</span>}
        {label}
      </p>
      <p className="text-sm font-semibold text-surface-900">{value}</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function ApplicationStatusPage() {
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState(false);
  const [demoStatus, setDemoStatusState] = useState(() => getDemoStatus());

  const handleDemoChange = (status: string) => {
    setDemoStatus(status);
    setDemoStatusState(status);
    queryClient.invalidateQueries({ queryKey: ["my-application"] });
  };

  const {
    data: application,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-application", demoStatus],
    queryFn: applicationRepository.getMyApplication,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="card p-6 space-y-6">
          <Skeleton className="h-4 w-40" />
          <div className="flex justify-between">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="card p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-surface-900 mb-2">
            No Application Found
          </h2>
          <p className="text-surface-500 text-sm mb-6">
            You haven&apos;t submitted an application yet. Start your journey
            today!
          </p>
          <Link href="/applicant/apply">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Apply Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Page heading */}
        <div className="page-header">
          <h1 className="page-title">My Application</h1>
          <p className="page-subtitle">
            Track the status of your application in real time
          </p>
        </div>

        {/* Demo switcher — shows all 3 states for testing */}
        <DemoSwitcher current={demoStatus} onChange={handleDemoChange} />

        {/* 1. Horizontal progress timeline */}
        <HorizontalTimeline application={application} />

        {/* 2. HR Decision panel — only when decision is made */}
        <HRDecisionPanel application={application} />

        {/* 3. Application summary card */}
        <ApplicationCard
          application={application}
          onViewDetails={() => setShowDetails(true)}
        />
      </div>

      {/* Full Application Details Modal */}
      {showDetails && (
        <ApplicationModal
          application={application}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
