import React from "react";

interface ProgressBannerProps {
  className?: string;
}

/**
 * Banner component for client-facing pages
 */
export function ProgressBanner({ className = "" }: ProgressBannerProps) {
  return (
    <div className={`bg-primary/10 p-3 text-center rounded-md ${className}`}>
      <p className="text-sm font-medium text-primary">
        Expert financial guidance for modern businesses
      </p>
    </div>
  );
}