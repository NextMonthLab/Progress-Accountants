import React from "react";
import { useTheme } from "@/components/ThemeProvider";

// Import the images directly
import NextMonthLogoWhite from "@assets/logos/nextmonth-logo-white.png";
import NextMonthLogo from "@assets/logos/nextmonth-logo.png";

interface PoweredByProps {
  className?: string;
}

export function PoweredBy({ className = "" }: PoweredByProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <div className={`flex items-center justify-end opacity-70 hover:opacity-100 transition-opacity ${className}`}>
      <span className="text-xs mr-2 text-muted-foreground">Powered by</span>
      <img 
        src={isDarkTheme ? NextMonthLogoWhite : NextMonthLogo} 
        alt="NextMonth Logo" 
        className="h-6" 
      />
    </div>
  );
}