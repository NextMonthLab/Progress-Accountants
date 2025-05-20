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
    <a 
      href="#" 
      className={`flex items-center justify-end opacity-70 hover:opacity-80 transition-opacity cursor-pointer ${className} fixed bottom-4 left-4 z-10`}
    >
      <img 
        src={isDarkTheme ? NextMonthLogoWhite : NextMonthLogo} 
        alt="NextMonth" 
        className="h-5" 
      />
    </a>
  );
}