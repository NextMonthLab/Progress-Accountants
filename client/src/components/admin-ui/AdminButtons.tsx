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
  const gradientClass = {
    "primary": "bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A] hover:opacity-90",
    "secondary": "bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A] hover:opacity-90",
    "pink-teal": "bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A] hover:opacity-90",
    // New gradients for NextMonth UI
    "teal-blue": "bg-gradient-to-r from-[#36d1dc] to-[#5b86e5] hover:opacity-90",
    "pink-coral": "bg-gradient-to-r from-[#f953c6] to-[#ff6b6b] hover:opacity-90"
  }[gradient];

  // Define shadow based on gradient type
  const shadowStyle = {
    "teal-blue": "hover:shadow-[0_4px_16px_rgba(54,209,220,0.3)]",
    "pink-coral": "hover:shadow-[0_4px_16px_rgba(249,83,198,0.3)]",
    "primary": "hover:shadow-[0_4px_16px_rgba(246,92,154,0.25)]",
    "secondary": "hover:shadow-[0_4px_16px_rgba(246,92,154,0.25)]",
    "pink-teal": "hover:shadow-[0_4px_16px_rgba(246,92,154,0.25)]"
  }[gradient];

  return (
    <Button
      className={cn(
        gradientClass,
        "text-white font-medium shadow-lg transition-all duration-300 border-0 rounded-xl px-6 py-3",
        shadowStyle,
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
  // Decide whether to use gradient or outline style
  const isGradient = variant === "default" || variant === undefined;
  
  return (
    <Button
      variant={isGradient ? "default" : variant}
      className={cn(
        isGradient ? 
          "bg-gradient-to-r from-[#36d1dc] to-[#5b86e5] text-white font-medium shadow-lg hover:shadow-[0_4px_16px_rgba(54,209,220,0.3)] hover:opacity-90 transition-all duration-300 border-0 rounded-xl px-6 py-3" : 
          "font-medium border-[#36d1dc] bg-gray-50 hover:bg-[#36d1dc]/10 transition-all text-gray-800 rounded-xl px-6 py-3",
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
  variant?: "primary" | "success" | "default" | "teal-blue" | "pink-coral";
}) {
  const variantClass = {
    "primary": "bg-gradient-to-r from-[#f953c6] to-[#ff6b6b] text-white",
    "success": "bg-[#3CBFAE] text-white",
    "default": "dark:bg-[#3A3A3A] dark:text-[#E0E0E0] bg-gray-300 text-gray-800 font-medium",
    "teal-blue": "bg-gradient-to-r from-[#36d1dc] to-[#5b86e5] text-white",
    "pink-coral": "bg-gradient-to-r from-[#f953c6] to-[#ff6b6b] text-white"
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