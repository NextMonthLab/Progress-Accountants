import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonProps {
  gradient?: "primary" | "secondary" | "pink-teal";
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
  const gradientClass = {
    "primary": "bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A] hover:opacity-90",
    "secondary": "bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A] hover:opacity-90",
    "pink-teal": "bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A] hover:opacity-90"
  }[gradient];

  return (
    <Button
      className={cn(
        gradientClass,
        "text-white font-medium shadow-lg hover:shadow-[0_4px_16px_rgba(246,92,154,0.25)] transition-all duration-300 border-0",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * ActionButton component for secondary actions in the NextMonth Gold UI design system
 */
export function ActionButton({
  className,
  variant = "outline",
  children,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        "font-medium dark:border-[#3A3A3A] border-gray-300 dark:bg-[#121212]/80 bg-gray-50 dark:hover:bg-[#1D1D1D] hover:bg-gray-100 transition-all dark:text-white text-gray-800",
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
                ? "dark:bg-[#121212] bg-gray-50 dark:text-white text-gray-900 border-b-2 border-[#F65C9A]" 
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
          active && "dark:bg-[#121212] bg-gray-50 dark:text-white text-gray-900 border-b-2 border-[#F65C9A]",
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
  variant?: "primary" | "success" | "default";
}) {
  const variantClass = {
    "primary": "bg-[#F65C9A] text-white",
    "success": "bg-[#3CBFAE] text-white",
    "default": "dark:bg-[#3A3A3A] dark:text-[#E0E0E0] bg-gray-300 text-gray-800 font-medium"
  }[variant];

  return (
    <div className={cn(
      "text-xs font-medium px-3 py-1.5 rounded-full",
      variantClass
    )}>
      {text}
    </div>
  );
}