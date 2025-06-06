import React, { useEffect, createContext, useContext } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>("dark");

  useEffect(() => {
    // Force dark mode permanently for all admin pages
    const root = window.document.documentElement;
    root.classList.remove("light", "system");
    root.classList.add("dark");
    
    // Set localStorage to dark to prevent any switching
    localStorage.setItem("smart-site-ui-theme", "dark");
  }, []);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem("smart-site-ui-theme", theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};