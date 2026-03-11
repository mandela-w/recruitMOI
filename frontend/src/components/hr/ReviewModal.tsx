"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { reviewSchema, type ReviewFormData } from "@/lib/validators/schemas";
import { cn } from "@/lib/utils";
import type { Application } from "@/types";

type ReviewAction = "APPROVED" | "REJECTED";

interface ReviewModalProps {
  application: Application | null;
  action: ReviewAction | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
}

const CONFIG: Record<
  ReviewAction,
  {
    title: string;
    description: string;
    placeholder: string;
    confirmLabel: string;
    icon: React.ReactNode;
    bannerClass: string;
    buttonVariant: "primary" | "danger";
  }
> = {
  APPROVED: {
    title: "Approve Application",
    description:
      "Provide a reason for your approval. This message will be visible to the applicant.",
    placeholder:
      "e.g. Excellent academic record with Division I results. Strong cover letter demonstrating relevant experience and motivation...",
    confirmLabel: "Confirm Approval",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    bannerClass: "bg-green-50 border-green-200 text-green-800",
    buttonVariant: "primary",
  },
  REJECTED: {
    title: "Reject Application",
    description:
      "Provide a reason for rejection. This message will be visible to the applicant.",
    placeholder:
      "e.g. The applicant does not meet the minimum qualification of Division I required for this role...",
    confirmLabel: "Confirm Rejection",
    icon: <XCircle className="w-5 h-5 text-rose-500" />,
    bannerClass: "bg-rose-50 border-rose-200 text-rose-800",
    buttonVariant: "danger",
  },
};

export function ReviewModal({
  application,
  action,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { status: action ?? "APPROVED", reason: "" },
  });

  // Reset the form whenever action changes so previous text doesn't bleed over
  useEffect(() => {
    reset({ status: action ?? "APPROVED", reason: "" });
  }, [action, reset]);

  const reason = watch("reason");
  const config = action ? CONFIG[action] : null;

  if (!config || !application) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={config.title}
      description={config.description}
      size="md"
    >
      {/* Applicant preview banner */}
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl border mb-5",
          config.bannerClass,
        )}
      >
        {config.icon}
        <div>
          <p className="text-sm font-semibold">
            {application.firstName} {application.lastName}
          </p>
          <p className="text-xs opacity-75">{application.positionAppliedFor}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((data) =>
          onSubmit({ ...data, status: action! }),
        )}
        className="space-y-5"
      >
        <Textarea
          label="Reason / Comments"
          placeholder={config.placeholder}
          rows={5}
          showCount
          maxLength={500}
          error={errors.reason?.message}
          required
          {...register("reason")}
        />

        {/* Character guidance */}
        {reason.length > 0 && reason.length < 10 && (
          <p className="flex items-center gap-1.5 text-xs text-amber-600">
            <AlertTriangle className="w-3.5 h-3.5" />
            At least 10 characters required ({10 - reason.length} more needed)
          </p>
        )}

        <div className="flex gap-3 justify-end pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={config.buttonVariant}
            isLoading={isSubmitting}
            leftIcon={
              !isSubmitting ? (
                action === "APPROVED" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )
              ) : undefined
            }
          >
            {config.confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
