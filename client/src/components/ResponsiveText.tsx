import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveTextProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  variant?: "display" | "heading" | "subheading" | "body" | "caption" | "small";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  color?: "primary" | "secondary" | "muted" | "white" | "navy" | "orange";
  align?: "left" | "center" | "right";
  className?: string;
}

const variantClasses = {
  display: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight",
  heading: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight",
  subheading: "text-xl sm:text-2xl md:text-3xl leading-snug",
  body: "text-base sm:text-lg leading-relaxed",
  caption: "text-sm sm:text-base leading-normal",
  small: "text-xs sm:text-sm leading-normal",
};

const weightClasses = {
  light: "font-light",
  normal: "font-normal", 
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const colorClasses = {
  primary: "text-gray-900",
  secondary: "text-gray-600",
  muted: "text-gray-500",
  white: "text-white",
  navy: "text-navy",
  orange: "text-orange",
};

const alignClasses = {
  left: "text-left",
  center: "text-center", 
  right: "text-right",
};

export const ResponsiveText = ({
  children,
  as: Component = "p",
  variant = "body",
  weight = "normal",
  color = "primary",
  align = "left",
  className,
}: ResponsiveTextProps) => {
  return (
    <Component
      className={cn(
        variantClasses[variant],
        weightClasses[weight],
        colorClasses[color],
        alignClasses[align],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default ResponsiveText;