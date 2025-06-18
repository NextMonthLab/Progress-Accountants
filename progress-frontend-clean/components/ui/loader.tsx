import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const Loader = ({ size = "md", className }: LoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
};