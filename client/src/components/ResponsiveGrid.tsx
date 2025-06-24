import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

const getColumnClasses = (cols: ResponsiveGridProps["cols"]) => {
  const classes: string[] = [];
  
  if (cols?.xs) classes.push(`grid-cols-${cols.xs}`);
  if (cols?.sm) classes.push(`sm:grid-cols-${cols.sm}`);
  if (cols?.md) classes.push(`md:grid-cols-${cols.md}`);
  if (cols?.lg) classes.push(`lg:grid-cols-${cols.lg}`);
  if (cols?.xl) classes.push(`xl:grid-cols-${cols.xl}`);
  if (cols?.["2xl"]) classes.push(`2xl:grid-cols-${cols["2xl"]}`);
  
  return classes;
};

const gapClasses = {
  none: "gap-0",
  sm: "gap-2 sm:gap-3",
  md: "gap-3 sm:gap-4 lg:gap-6",
  lg: "gap-4 sm:gap-6 lg:gap-8",
  xl: "gap-6 sm:gap-8 lg:gap-12",
};

const alignClasses = {
  start: "items-start",
  center: "items-center", 
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export const ResponsiveGrid = ({
  children,
  className,
  cols = { xs: 1, sm: 2, lg: 3 },
  gap = "md",
  align = "stretch",
  justify = "start",
}: ResponsiveGridProps) => {
  const columnClasses = getColumnClasses(cols);
  
  return (
    <div className={cn(
      "grid w-full",
      ...columnClasses,
      gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;