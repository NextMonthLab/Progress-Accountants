import React from "react";
import { useTheme } from "@/components/ThemeProvider";

// New NextMonth logo URL
const NextMonthLogoURL = "https://res.cloudinary.com/drl0fxrkq/image/upload/v1746537994/8A3D82EC-31EF-4209-85E2-D1D284F5E960_lnzuah.png";

interface PoweredByProps {
  className?: string;
}

export function PoweredBy({ className = "" }: PoweredByProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <a 
      href="https://nextmonth.io" 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center justify-end opacity-70 hover:opacity-80 transition-opacity cursor-pointer ${className} fixed bottom-4 left-4 z-10`}
    >
      <img 
        src={NextMonthLogoURL} 
        alt="NextMonth" 
        className="h-6" 
      />
    </a>
  );
}