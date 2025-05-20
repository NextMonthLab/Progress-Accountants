import React from "react";
import { useTheme } from "@/components/ThemeProvider";

// Import the logos using public URLs
const NextMonthLogo = "/assets/logos/nextmonth-logo.png";
const NextMonthLogoWhite = "/assets/logos/nextmonth-logo-white.png";

interface PoweredByProps {
  className?: string;
}

export function PoweredBy({ className = "" }: PoweredByProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <div className={`flex items-center justify-end opacity-70 hover:opacity-100 transition-opacity ${className} fixed bottom-4 left-4 z-10`}>
      <span className="text-xs mr-2 text-slate-500">Powered by</span>
      <img 
        src={isDarkTheme ? NextMonthLogoWhite : NextMonthLogo} 
        alt="NextMonth Logo" 
        className="h-5" 
      />
    </div>
  );
}