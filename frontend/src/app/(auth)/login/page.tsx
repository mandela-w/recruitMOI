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
  ArrowRight,
  BriefcaseBusiness,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginFormData } from "@/lib/validators/schemas";
import type { Role } from "@/types";

const demoCredentials: {
  role: Role;
  email: string;
  password: string;
  label: string;
  color: string;
}[] = [
  {
    role: "APPLICANT",
    email: "applicant@demo.com",
    password: "Demo@1234",
    label: "Applicant",
    color: "hover:bg-brand-600 hover:text-white hover:border-brand-600",
  },
  {
    role: "HR",
    email: "hr@demo.com",
    password: "Demo@1234",
    label: "HR Manager",
    color: "hover:bg-brand-700 hover:text-white hover:border-brand-700",
  },
  {
    role: "SUPER_ADMIN",
    email: "admin@demo.com",
    password: "Demo@1234",
    label: "Super Admin",
    color: "hover:bg-amber-500 hover:text-white hover:border-amber-500",
  },
];

const ROLE_REDIRECT: Record<Role, string> = {
  APPLICANT: "/applicant/apply",
  HR: "/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [quickLoading, setQuickLoading] = useState<Role | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data);
      const user = useAuthStore.getState().user;
      router.push(user ? ROLE_REDIRECT[user.role] : "/dashboard");
    } catch {}
  };

  const handleQuickLogin = async (cred: (typeof demoCredentials)[0]) => {
    clearError();
    setQuickLoading(cred.role);
    try {
      await login({ email: cred.email, password: cred.password });
      router.push(ROLE_REDIRECT[cred.role]);
    } catch {
      setQuickLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 items-center justify-center p-12">
        <div className="absolute w-96 h-96 rounded-full bg-brand-500/20 blur-3xl -top-20 -left-20 animate-pulse-slow" />
        <div
          className="absolute w-80 h-80 rounded-full bg-brand-400/20 blur-3xl bottom-10 right-10 animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-lg text-white">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <BriefcaseBusiness className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold">
              Recruit<span className="text-brand-300">Moi</span>
            </span>
          </div>

          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Rwanda&apos;s Smartest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-300">
              Recruitment Platform
            </span>
          </h1>
          <p className="text-brand-200 text-lg leading-relaxed mb-10">
            Apply for positions, manage candidates, and make data-driven hiring
            decisions — all in one beautiful platform.
          </p>

          <div className="space-y-4">
            {[
              "Instant NID & NESA verification",
              "Real-time application tracking",
              "Smart analytics dashboard",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-400/30 border border-brand-400/50 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-brand-300" />
                </div>
                <span className="text-brand-100 text-sm">{f}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
            {[
              { value: "500+", label: "Applicants" },
              { value: "98%", label: "Satisfaction" },
              { value: "< 2min", label: "Avg. Review" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-white">
                  {s.value}
                </p>
                <p className="text-brand-300 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
              <BriefcaseBusiness className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold">
              Recruit<span className="gradient-text">Moi</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-surface-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-surface-500 mt-2 text-sm">
              Sign in to continue to your account
            </p>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-brand-50 border border-brand-100">
            <p className="text-xs font-semibold text-brand-700 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Quick Access — click to log in instantly
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => handleQuickLogin(cred)}
                  disabled={isLoading || quickLoading !== null}
                  className={`relative text-xs px-3 py-2.5 rounded-lg bg-white border border-brand-200 text-brand-700 font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${cred.color}`}
                >
                  {quickLoading === cred.role ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    <>
                      <span className="block">{cred.label}</span>
                      <span className="block text-[10px] font-normal opacity-70 mt-0.5">
                        one click
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-brand-500 mt-2.5 text-center">
              Each button logs you in as that role with demo data
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400 font-medium">
              or sign in manually
            </span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm animate-scale-in">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading && quickLoading === null}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading && quickLoading === null ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            New applicant?{" "}
            <Link
              href="/register"
              className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
