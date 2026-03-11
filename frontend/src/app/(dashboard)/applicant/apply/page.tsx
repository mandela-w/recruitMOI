import type { Metadata } from "next";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = { title: "Apply Now" };

export default function ApplyPage() {
  return (
    <ToastProvider>
      <div className="max-w-2xl mx-auto">
        <div className="page-header">
          <h1 className="page-title">Submit Application</h1>
          <p className="page-subtitle">
            Complete the steps below to submit your application. Your NID and
            NESA records will be verified automatically.
          </p>
        </div>
        <ApplicationForm />
      </div>
    </ToastProvider>
  );
}
