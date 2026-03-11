"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-rose-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-sky-500" />,
};

const typeStyles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-white",
  error: "border-rose-200 bg-white",
  warning: "border-amber-200 bg-white",
  info: "border-sky-200 bg-white",
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 200);
  }, [onRemove, toast.id]);

  useEffect(() => {
    const timer = setTimeout(handleRemove, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [handleRemove, toast.duration]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border shadow-elevated",
        "transition-all duration-200",
        typeStyles[toast.type],
        isLeaving ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0 animate-slide-in-right"
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-surface-900">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-surface-500 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-0.5 rounded-md text-surface-400 hover:text-surface-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) =>
    addToast({ type: "success", title, message }), [addToast]);
  const error = useCallback((title: string, message?: string) =>
    addToast({ type: "error", title, message }), [addToast]);
  const warning = useCallback((title: string, message?: string) =>
    addToast({ type: "warning", title, message }), [addToast]);
  const info = useCallback((title: string, message?: string) =>
    addToast({ type: "info", title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
