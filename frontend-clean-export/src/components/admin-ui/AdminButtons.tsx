import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonProps {
  gradient?: "primary" | "secondary" | "pink-teal" | "teal-blue" | "pink-coral";
  children: React.ReactNode;
}

/**
 * GradientButton component for primary actions in the NextMonth Gold UI design system
 */
export function GradientButton({
  gradient = "primary",
  className,
  children,
  ...props
}: GradientButtonProps) {
  // Modernized solid colors following the new design system
  const colorClass = {
    "primary": "bg-[#4F46E5] hover:bg-[#6366F1]", // Primary action (indigo)
    "secondary": "bg-[#E0F2FE] text-[#0284C7] hover:bg-[#BAE6FD]", // Secondary info (light blue)
    "pink-teal": "bg-[#14B8A6] hover:bg-[#0D9488]", // AI tools accent (teal)
    "teal-blue": "bg-[#0284C7] hover:bg-[#0369A1]", // Informational actions (blue)
    "pink-coral": "bg-[#4F46E5] hover:bg-[#6366F1]"  // Legacy - now mapped to primary
  }[gradient];

  // Text color changes for secondary buttons
  const textColorClass = gradient === "secondary" ? "text-[#0284C7]" : "text-white";

  return (
    <Button
      className={cn(
        colorClass,
        textColorClass,
        "font-medium shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * ActionButton component for secondary/informational actions in the NextMonth Gold UI design system
 * Uses the teal-blue gradient styling for informational actions by default
 */
export function ActionButton({
  className,
  variant = "outline",
  children,
  ...props
}: ButtonProps) {
  // Decide whether to use solid or outline style
  const isSolid = variant === "default" || variant === undefined;
  
  return (
    <Button
      variant={isSolid ? "secondary" : variant}
      className={cn(
        isSolid ? 
          "bg-[#E0F2FE] text-[#0284C7] hover:bg-[#BAE6FD] font-medium shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2" : 
          "font-medium border-gray-200 bg-white hover:bg-gray-50 transition-all text-gray-700 rounded-lg px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * TabsNav component for tab navigation in the NextMonth Gold UI design system
 */
export function TabsNav({
  tabs,
  activeTab,
  onChange,
  className
}: {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn(
      "dark:bg-[#0A0A0A] bg-white dark:border-[#1D1D1D] border-gray-200 grid w-full rounded-lg overflow-hidden shadow-sm",
      className
    )}>
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "dark:text-white text-gray-800 py-3 px-4 flex items-center gap-2 text-sm font-medium transition-colors",
              activeTab === tab.id 
                ? "dark:bg-[#121212] bg-gray-50 dark:text-white text-gray-900 border-b-2 border-[#4F46E5]" 
                : "dark:text-[#9E9E9E] text-gray-600 border-b-2 border-transparent"
            )}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * NavItem component for top navigation items in the NextMonth Gold UI design system
 */
export function NavItem({
  label,
  icon,
  children,
  onClick,
  className,
  active = false
}: {
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}) {
  return (
    <div className="relative group">
      <Button
        variant="ghost"
        className={cn(
          "dark:text-white text-gray-800 font-medium px-3 py-2 h-auto flex items-center gap-2 text-sm transition-colors",
          active && "dark:bg-[#121212] bg-gray-50 dark:text-white text-gray-900 border-b-2 border-[#4F46E5]",
          !active && "dark:text-[#9E9E9E] text-gray-600 border-b-2 border-transparent",
          className
        )}
        onClick={onClick}
      >
        {icon && <span className="h-4 w-4">{icon}</span>}
        {label}
        {children && (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-4 w-4"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </Button>
      
      {children && (
        <div className="absolute left-0 mt-1 w-48 dark:bg-[#0A0A0A] bg-white dark:border-[#1D1D1D] border-gray-200 rounded-lg shadow-lg p-2 invisible group-hover:visible z-50">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Badge component for tags and badges in the NextMonth Gold UI design system
 */
export function Badge({
  text,
  variant = "default"
}: {
  text: string;
  variant?: "primary" | "success" | "default" | "teal-blue" | "pink-coral";
}) {
  // Modern, subtle badge styles with solid colors
  const variantClass = {
    "primary": "bg-indigo-50 text-indigo-600 border border-indigo-100",
    "success": "bg-teal-50 text-teal-600 border border-teal-100",
    "default": "bg-gray-100 text-gray-600 border border-gray-200",
    "teal-blue": "bg-blue-50 text-blue-600 border border-blue-100",
    "pink-coral": "bg-indigo-50 text-indigo-600 border border-indigo-100"
  }[variant];

  return (
    <div className={cn(
      "text-xs font-normal px-2 py-1 rounded-full",
      variantClass
    )}>
      {text.toLowerCase()}
    </div>
  );
}