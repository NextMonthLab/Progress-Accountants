import React from "react";

interface ProgressBannerProps {
  className?: string;
}

/**
 * Banner component for client-facing pages showing "Thank you for choosing Progress Accountants"
 */
export function ProgressBanner({ className = "" }: ProgressBannerProps) {
  return (
    <div className={`bg-primary/10 p-3 text-center rounded-md ${className}`}>
      <p className="text-sm font-medium text-primary">
        Thank you for choosing Progress Accountants for your business needs
      </p>
    </div>
  );
}