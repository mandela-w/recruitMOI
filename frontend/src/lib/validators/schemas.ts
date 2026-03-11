import { z } from "zod";

// ── Auth Schemas ─────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name too long"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── NID Verification Schema ───────────────────────────────────
export const nidSchema = z.object({
  nid: z
    .string()
    .min(16, "NID must be 16 characters")
    .max(16, "NID must be 16 characters")
    .regex(/^[0-9]{16}$/, "NID must contain only digits"),
});

// ── NESA Verification Schema ──────────────────────────────────
export const nesaSchema = z.object({
  nesaIndexNumber: z
    .string()
    .min(6, "NESA index number is required")
    .regex(/^[A-Z0-9\-\/]+$/i, "Invalid NESA index number format"),
});

// ── Application Schema ────────────────────────────────────────
export const applicationDetailsSchema = z.object({
  positionAppliedFor: z
    .string()
    .min(3, "Position is required")
    .max(100, "Position name too long"),
  coverLetter: z
    .string()
    .min(100, "Cover letter must be at least 100 characters")
    .max(3000, "Cover letter must not exceed 3000 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
});

// ── Review Schema ─────────────────────────────────────────────
export const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    message: "Please select a decision",
  }),
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters"),
});

// ── User Management Schema ────────────────────────────────────
export const createUserSchema = z
  .object({
    firstName: z.string().min(2, "First name required").max(50),
    lastName: z.string().min(2, "Last name required").max(50),
    email: z.string().email("Invalid email address"),
    role: z.enum(["APPLICANT", "HR", "SUPER_ADMIN"]),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[0-9]/, "Must contain number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(["APPLICANT", "HR", "SUPER_ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});

// ── Type Exports ──────────────────────────────────────────────
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type NIDFormData = z.infer<typeof nidSchema>;
export type NESAFormData = z.infer<typeof nesaSchema>;
export type ApplicationDetailsFormData = z.infer<
  typeof applicationDetailsSchema
>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
