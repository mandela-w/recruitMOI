"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-surface-700"
          >
            {label}
            {props.required && (
              <span className="text-rose-500 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input-base",
              leftIcon && "pl-10",
              rightElement && "pr-10",
              error && "input-error",
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-rose-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-surface-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
