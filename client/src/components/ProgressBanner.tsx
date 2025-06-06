import React from "react";
import { Link } from "wouter";

interface ProgressBannerProps {
  className?: string;
}

/**
 * Banner component for client-facing pages
 */
export function ProgressBanner({ className = "" }: ProgressBannerProps) {
  return (
    <div className={`bg-primary/10 px-3 text-center rounded-md flex items-center min-h-[60px] ${className}`}>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full">
        <p className="text-sm font-medium text-primary">
          Expert financial guidance for modern businesses
        </p>
        <span className="hidden sm:inline text-primary">•</span>
        <Link href="/studio-banbury" className="text-sm font-medium text-[#7B3FE4] hover:underline cursor-pointer">
          🎙️ Visit our Professional Podcast & Video Studio
        </Link>
      </div>
    </div>
  );
}