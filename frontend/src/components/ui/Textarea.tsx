"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showCount, maxLength, className, id, value, ...props }, ref) => {
    const inputId = id || props.name;
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-surface-700">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          className={cn(
            "input-base resize-none",
            error && "input-error",
            className
          )}
          {...props}
        />

        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </p>
            )}
            {hint && !error && <p className="text-xs text-surface-400">{hint}</p>}
          </div>
          {showCount && maxLength && (
            <p className={cn(
              "text-xs ml-auto",
              currentLength > maxLength * 0.9 ? "text-amber-500" : "text-surface-400"
            )}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
