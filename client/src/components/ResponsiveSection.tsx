import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ResponsiveContainer from "./ResponsiveContainer";

interface ResponsiveSectionProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "gray" | "dark" | "gradient" | "transparent";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  containerPadding?: "none" | "sm" | "md" | "lg" | "xl";
  id?: string;
}

const backgroundClasses = {
  white: "bg-white",
  gray: "bg-gray-50",
  dark: "bg-slate-900",
  gradient: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
  transparent: "bg-transparent",
};

const paddingClasses = {
  none: "",
  sm: "py-8 sm:py-12",
  md: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-20 lg:py-24",
  xl: "py-20 sm:py-24 lg:py-32",
};

export const ResponsiveSection = ({
  children,
  className,
  background = "white",
  padding = "md",
  maxWidth = "xl",
  containerPadding = "lg",
  id,
}: ResponsiveSectionProps) => {
  return (
    <section 
      id={id}
      className={cn(
        "w-full",
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      <ResponsiveContainer maxWidth={maxWidth} padding={containerPadding}>
        {children}
      </ResponsiveContainer>
    </section>
  );
};

export default ResponsiveSection;