import React, { useEffect } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Force dark mode permanently for all admin pages
    const root = window.document.documentElement;
    root.classList.remove("light", "system");
    root.classList.add("dark");
    
    // Set localStorage to dark to prevent any switching
    localStorage.setItem("smart-site-ui-theme", "dark");
  }, []);

  return <>{children}</>;
};