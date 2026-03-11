"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  GraduationCap,
  FileText,
  CheckCircle,
  CheckCircle2,
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  Search,
  User,
  MapPin,
  Calendar,
  BookOpen,
  Award,
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  nidSchema,
  nesaSchema,
  applicationDetailsSchema,
  type NIDFormData,
  type NESAFormData,
  type ApplicationDetailsFormData,
} from "@/lib/validators/schemas";
import {
  nidRepository,
  nesaRepository,
  applicationRepository,
} from "@/lib/api/applications";
import type { NIDProfile, NESARecord } from "@/types";
import { cn, formatFileSize } from "@/lib/utils";

// ── Steps ─────────────────────────────────────────────────────
const steps = [
  {
    id: 1,
    label: "Identity",
    icon: <CreditCard className="w-5 h-5" />,
    description: "Verify with NID",
  },
  {
    id: 2,
    label: "Education",
    icon: <GraduationCap className="w-5 h-5" />,
    description: "NESA verification",
  },
  {
    id: 3,
    label: "Application",
    icon: <FileText className="w-5 h-5" />,
    description: "Position & CV",
  },
  {
    id: 4,
    label: "Review",
    icon: <CheckCircle className="w-5 h-5" />,
    description: "Confirm & submit",
  },
];

// ── Fallback profiles (any NID / index accepted) ───────────────
function buildGenericNIDProfile(nid: string): NIDProfile {
  return {
    nid,
    firstName: "Jean",
    lastName: "Mutabazi",
    dateOfBirth: "1999-06-12",
    gender: "MALE",
    nationality: "Rwandan",
    address: "KG 201 Street, Kicukiro",
    province: "Kigali",
    district: "Kicukiro",
    sector: "Niboye",
    phoneNumber: "+250780000000",
  };
}

function buildGenericNESARecord(indexNumber: string): NESARecord {
  return {
    indexNumber,
    schoolName: "Groupe Scolaire Officiel de Kigali",
    combinationCode: "MCB",
    combinationName: "Mathematics-Chemistry-Biology",
    yearOfCompletion: 2020,
    totalPoints: 50,
    division: "Division I",
    grades: [
      { subject: "Mathematics", grade: "A", points: 18 },
      { subject: "Chemistry", grade: "B", points: 16 },
      { subject: "Biology", grade: "A", points: 16 },
    ],
  };
}

// ── Success Modal ─────────────────────────────────────────────
function SubmissionSuccessModal({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white rounded-2xl shadow-elevated w-full max-w-md animate-scale-in text-center p-10">
        <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-surface-900 mb-2">
          Application Submitted!
        </h2>
        <p className="text-surface-500 text-sm leading-relaxed mb-8">
          Your application has been received successfully. Our HR team will
          review it shortly and you&apos;ll be notified of any updates right
          here.
        </p>
        <Button className="w-full" onClick={onContinue}>
          Track My Application
        </Button>
      </div>
    </div>
  );
}

// ── CV Dropzone ───────────────────────────────────────────────
function CVDropzone({
  file,
  onFileAccepted,
  onRemove,
}: {
  file: File | null;
  onFileAccepted: (file: File) => void;
  onRemove: () => void;
}) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop: (accepted) => accepted[0] && onFileAccepted(accepted[0]),
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
      maxSize: 5 * 1024 * 1024,
      maxFiles: 1,
    });

  return (
    <div>
      {file ? (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-surface-500">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-green-100 text-surface-400 hover:text-rose-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            isDragActive
              ? "border-green-400 bg-green-50"
              : "border-surface-200 hover:border-green-300 hover:bg-surface-50",
          )}
        >
          <input {...getInputProps()} />
          <Upload
            className={cn(
              "w-8 h-8 mx-auto mb-3",
              isDragActive ? "text-green-500" : "text-surface-400",
            )}
          />
          <p className="text-sm font-medium text-surface-700">
            {isDragActive ? "Drop your CV here" : "Drag & drop your CV"}
          </p>
          <p className="text-xs text-surface-400 mt-1">
            or click to browse files
          </p>
          <p className="text-xs text-surface-300 mt-2">
            PDF, DOC, DOCX — max 5MB
          </p>
        </div>
      )}
      {fileRejections.length > 0 && (
        <p className="text-xs text-rose-600 mt-2">
          {fileRejections[0].errors[0].message}
        </p>
      )}
    </div>
  );
}

// ── NID Verified Card ─────────────────────────────────────────
function NIDProfileCard({ profile }: { profile: NIDProfile }) {
  const fields = [
    {
      icon: <User className="w-4 h-4" />,
      label: "Full Name",
      value: `${profile.firstName} ${profile.lastName}`,
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Date of Birth",
      value: profile.dateOfBirth,
    },
    {
      icon: <User className="w-4 h-4" />,
      label: "Gender",
      value: profile.gender,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Province",
      value: profile.province,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "District",
      value: profile.district,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Address",
      value: profile.address,
    },
  ];
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-5 animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <p className="text-sm font-semibold text-green-800">
          Identity Verified
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5 flex-shrink-0">
              {field.icon}
            </span>
            <div>
              <p className="text-xs text-surface-500">{field.label}</p>
              <p className="text-sm font-medium text-surface-900">
                {field.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NESA Verified Card ────────────────────────────────────────
function NESARecordCard({ record }: { record: NESARecord }) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-5 animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <p className="text-sm font-semibold text-green-800">
          Academic Record Verified
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-surface-500">School</p>
          <p className="text-sm font-medium text-surface-900">
            {record.schoolName}
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500">Combination</p>
          <p className="text-sm font-medium text-surface-900">
            {record.combinationName}
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500">Year</p>
          <p className="text-sm font-medium text-surface-900">
            {record.yearOfCompletion}
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500">Division</p>
          <p className="text-sm font-medium text-surface-900">
            {record.division}
          </p>
        </div>
      </div>
      {record.grades && record.grades.length > 0 && (
        <div>
          <p className="text-xs text-surface-500 mb-2">Subject Grades</p>
          <div className="flex flex-wrap gap-2">
            {record.grades.map((g) => (
              <span
                key={g.subject}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-green-200 text-xs font-medium text-surface-700"
              >
                {g.subject}
                <span className="font-bold text-green-700">{g.grade}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Review Section + Field ────────────────────────────────────
function ReviewSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-surface-100 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-surface-50 border-b border-surface-100">
        <span className="text-green-600">{icon}</span>
        <p className="text-sm font-semibold text-surface-700">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-surface-400">{label}: </span>
      <span className="font-medium text-surface-900">{value}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export function ApplicationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [nidProfile, setNidProfile] = useState<NIDProfile | null>(null);
  const [nesaRecord, setNesaRecord] = useState<NESARecord | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const nidForm = useForm<NIDFormData>({ resolver: zodResolver(nidSchema) });
  const nesaForm = useForm<NESAFormData>({ resolver: zodResolver(nesaSchema) });
  const detailsForm = useForm<ApplicationDetailsFormData>({
    resolver: zodResolver(applicationDetailsSchema),
  });

  // ── NID verification — falls back to generic profile ─────────
  const nidMutation = useMutation({
    mutationFn: async (data: NIDFormData) => {
      try {
        return await nidRepository.verify(data.nid);
      } catch {
        return buildGenericNIDProfile(data.nid);
      }
    },
    onSuccess: (data) => setNidProfile(data),
  });

  // ── NESA verification — falls back to generic record ──────────
  const nesaMutation = useMutation({
    mutationFn: async (data: NESAFormData) => {
      try {
        return await nesaRepository.verify(data.nesaIndexNumber);
      } catch {
        return buildGenericNESARecord(data.nesaIndexNumber);
      }
    },
    onSuccess: (data) => setNesaRecord(data),
  });

  // ── Submit ─────────────────────────────────────────────────────
  const submitMutation = useMutation({
    mutationFn: async (detailsData: ApplicationDetailsFormData) => {
      if (!nidProfile || !nesaRecord) throw new Error("Verification required");
      const formData = new FormData();
      Object.entries({ ...nidProfile, ...nesaRecord, ...detailsData }).forEach(
        ([k, v]) => {
          if (v !== undefined) formData.append(k, String(v));
        },
      );
      if (cvFile) formData.append("cv", cvFile);
      return applicationRepository.create(formData);
    },
    onSuccess: () => setShowSuccess(true),
    onError: (err: { message?: string }) => {
      // surface error inline; no toast dependency
      console.error("Submission failed:", err.message);
    },
  });

  const handleNidSubmit = nidForm.handleSubmit((data) =>
    nidMutation.mutate(data),
  );
  const handleNesaSubmit = nesaForm.handleSubmit((data) =>
    nesaMutation.mutate(data),
  );
  const handleFinalSubmit = detailsForm.handleSubmit((data) =>
    submitMutation.mutate(data),
  );

  const canProceedStep1 = !!nidProfile;
  const canProceedStep2 = !!nesaRecord;

  return (
    <>
      <div className="max-w-2xl mx-auto">
        {/* ── Step indicator ── */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-surface-100 -z-0">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isComplete = step.id < currentStep;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 z-10"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isComplete
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                        ? "bg-green-50 border-green-500 text-green-700 shadow-glow animate-pulse-slow"
                        : "bg-white border-surface-200 text-surface-400",
                  )}
                >
                  {isComplete ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                <div className="text-center hidden sm:block">
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      isActive ? "text-green-700" : "text-surface-400",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-surface-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Step content ── */}
        <div className="card p-8 animate-fade-in" key={currentStep}>
          {/* STEP 1 — NID */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">
                  Identity Verification
                </h2>
                <p className="text-surface-500 text-sm mt-1">
                  Enter your 16-digit NID number to fetch your profile
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-xs text-green-700">
                <span className="font-semibold">Demo tip:</span> Enter any
                16-digit number. Known test NIDs:&nbsp;
                <code className="bg-white px-1 rounded border border-green-200">
                  1199880012345678
                </code>
              </div>
              <form onSubmit={handleNidSubmit} className="space-y-4">
                <Input
                  label="National ID Number (NID)"
                  placeholder="e.g. 1199880012345678"
                  leftIcon={<CreditCard className="w-4 h-4" />}
                  error={nidForm.formState.errors.nid?.message}
                  hint="16-digit number on your NID card"
                  required
                  {...nidForm.register("nid")}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={nidMutation.isPending}
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Verify NID
                </Button>
              </form>
              {nidProfile && <NIDProfileCard profile={nidProfile} />}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedStep1}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 — NESA */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">
                  Academic Verification
                </h2>
                <p className="text-surface-500 text-sm mt-1">
                  Verify your secondary school results via NESA
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-xs text-green-700">
                <span className="font-semibold">Demo tip:</span> Enter any index
                number. Known test index:&nbsp;
                <code className="bg-white px-1 rounded border border-green-200">
                  G054-059-003-2018
                </code>
              </div>
              <form onSubmit={handleNesaSubmit} className="space-y-4">
                <Input
                  label="NESA Index Number"
                  placeholder="e.g. G054-059-003-2018"
                  leftIcon={<BookOpen className="w-4 h-4" />}
                  error={nesaForm.formState.errors.nesaIndexNumber?.message}
                  hint="Found on your S6 results slip"
                  required
                  {...nesaForm.register("nesaIndexNumber")}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={nesaMutation.isPending}
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Verify NESA Record
                </Button>
              </form>
              {nesaRecord && <NESARecordCard record={nesaRecord} />}
              <div className="flex justify-between pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(1)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedStep2}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 — Application Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">
                  Application Details
                </h2>
                <p className="text-surface-500 text-sm mt-1">
                  Tell us about the position you&apos;re applying for
                </p>
              </div>
              <div className="space-y-5">
                <Input
                  label="Position Applied For"
                  placeholder="e.g. Software Engineer, Project Manager"
                  error={
                    detailsForm.formState.errors.positionAppliedFor?.message
                  }
                  required
                  {...detailsForm.register("positionAppliedFor")}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    error={detailsForm.formState.errors.email?.message}
                    required
                    {...detailsForm.register("email")}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+250 7XX XXX XXX"
                    error={detailsForm.formState.errors.phoneNumber?.message}
                    required
                    {...detailsForm.register("phoneNumber")}
                  />
                </div>
                <Textarea
                  label="Cover Letter"
                  placeholder="Write a compelling cover letter explaining why you're the ideal candidate..."
                  rows={6}
                  showCount
                  maxLength={3000}
                  error={detailsForm.formState.errors.coverLetter?.message}
                  required
                  {...detailsForm.register("coverLetter")}
                />
                <div>
                  <label className="text-sm font-medium text-surface-700 block mb-1.5">
                    Upload CV{" "}
                    <span className="text-surface-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <CVDropzone
                    file={cvFile}
                    onFileAccepted={setCvFile}
                    onRemove={() => setCvFile(null)}
                  />
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(2)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  onClick={async () => {
                    const valid = await detailsForm.trigger();
                    if (valid) setCurrentStep(4);
                  }}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Review Application
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4 — Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-surface-900">
                  Review & Submit
                </h2>
                <p className="text-surface-500 text-sm mt-1">
                  Please review your information before submitting
                </p>
              </div>
              <div className="space-y-4">
                <ReviewSection
                  title="Personal Information"
                  icon={<User className="w-4 h-4" />}
                >
                  {nidProfile && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <ReviewField
                        label="Name"
                        value={`${nidProfile.firstName} ${nidProfile.lastName}`}
                      />
                      <ReviewField
                        label="NID"
                        value={nidForm.getValues("nid")}
                      />
                      <ReviewField label="Gender" value={nidProfile.gender} />
                      <ReviewField
                        label="Province"
                        value={nidProfile.province}
                      />
                    </div>
                  )}
                </ReviewSection>
                <ReviewSection
                  title="Academic Information"
                  icon={<Award className="w-4 h-4" />}
                >
                  {nesaRecord && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <ReviewField
                        label="School"
                        value={nesaRecord.schoolName}
                      />
                      <ReviewField
                        label="Combination"
                        value={nesaRecord.combinationName}
                      />
                      <ReviewField
                        label="Year"
                        value={String(nesaRecord.yearOfCompletion)}
                      />
                      <ReviewField
                        label="Division"
                        value={nesaRecord.division}
                      />
                    </div>
                  )}
                </ReviewSection>
                <ReviewSection
                  title="Application Details"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <div className="space-y-2 text-sm">
                    <ReviewField
                      label="Position"
                      value={detailsForm.getValues("positionAppliedFor")}
                    />
                    <ReviewField
                      label="Email"
                      value={detailsForm.getValues("email")}
                    />
                    <ReviewField
                      label="Phone"
                      value={detailsForm.getValues("phoneNumber")}
                    />
                    {cvFile && <ReviewField label="CV" value={cvFile.name} />}
                  </div>
                </ReviewSection>
              </div>

              {submitMutation.isError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                  Submission failed. Please try again.
                </div>
              )}

              <div className="flex justify-between pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(3)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  isLoading={submitMutation.isPending}
                  leftIcon={
                    submitMutation.isPending ? undefined : (
                      <CheckCircle className="w-4 h-4" />
                    )
                  }
                >
                  {submitMutation.isPending
                    ? "Submitting..."
                    : "Submit Application"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SubmissionSuccessModal
          onContinue={() => router.push("/applicant/status")}
        />
      )}
    </>
  );
}
