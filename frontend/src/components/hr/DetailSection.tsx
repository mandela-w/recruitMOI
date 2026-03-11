import { cn } from "@/lib/utils";

interface DetailSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DetailSection({
  title,
  icon,
  children,
  className,
}: DetailSectionProps) {
  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-surface-100 bg-surface-50/60">
        <span className="text-green-600 flex-shrink-0">{icon}</span>
        <h3 className="font-display font-semibold text-surface-800 text-sm uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  multiline?: boolean;
}

export function DetailRow({
  label,
  value,
  icon,
  highlight = false,
  multiline = false,
}: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex gap-3 py-3 border-b border-surface-50 last:border-0",
        multiline ? "flex-col" : "items-start",
      )}
    >
      {icon && !multiline && (
        <span className="text-surface-300 mt-0.5 flex-shrink-0 w-4">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-surface-400 mb-0.5">{label}</p>
        <p
          className={cn(
            "text-sm break-words",
            highlight
              ? "font-bold text-green-700"
              : "font-medium text-surface-900",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
