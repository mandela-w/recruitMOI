import { getInitials, cn } from "@/lib/utils";

interface ApplicantAvatarProps {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

export function ApplicantAvatar({
  firstName,
  lastName,
  size = "md",
  className,
}: ApplicantAvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-green-500 to-green-700",
        "flex items-center justify-center text-white font-bold flex-shrink-0",
        sizeMap[size],
        className,
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}
