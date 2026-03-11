"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Layers,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validators/schemas";
import { cn } from "@/lib/utils";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Lowercase letter", pass: /[a-z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.pass).length;
  const strengthColors = [
    "bg-surface-200",
    "bg-rose-500",
    "bg-amber-500",
    "bg-brand-500",
    "bg-emerald-500",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i <= strength ? strengthColors[strength] : "bg-surface-100",
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          "text-xs font-medium",
          strength <= 1
            ? "text-rose-500"
            : strength <= 2
              ? "text-amber-500"
              : strength <= 3
                ? "text-brand-600"
                : "text-emerald-600",
        )}
      >
        {strengthLabels[strength]}
      </p>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            <CheckCircle
              className={cn(
                "w-3 h-3",
                check.pass ? "text-emerald-500" : "text-surface-300",
              )}
            />
            <span
              className={cn(
                "text-xs",
                check.pass ? "text-surface-600" : "text-surface-400",
              )}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
  } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    const { confirmPassword: _, ...payload } = data;
    try {
      await registerUser(payload);
      router.push("/applicant/apply");
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 ...
 flex items-center justify-center shadow-glow"
          >
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold">
            Recruit<span className="gradient-text">RW</span>
          </span>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-surface-900">
              Create Account
            </h1>
            <p className="text-surface-500 text-sm mt-1.5">
              Start your application journey today
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.firstName?.message}
                required
                {...register("firstName")}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                required
                {...register("lastName")}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                leftIcon={<Lock className="w-4 h-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-surface-400 hover:text-surface-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                required
                {...register("password")}
              />
              {password && <PasswordStrength password={password} />}
            </div>

            <Input
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-surface-400 hover:text-surface-600"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              error={errors.confirmPassword?.message}
              required
              {...register("confirmPassword")}
            />

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
