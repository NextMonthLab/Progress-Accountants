import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonProps {
  gradient?: "pink-teal" | "pink-purple" | "blue-purple";
  children: React.ReactNode;
}

/**
 * GradientButton component for primary actions in the Lead Radar design system
 */
export function GradientButton({
  gradient = "pink-teal",
  className,
  children,
  ...props
}: GradientButtonProps) {
  const gradientClass = {
    "pink-teal": "bg-gradient-to-r from-[#d65db1] to-[#5EB8B6] hover:from-[#c44ca0] hover:to-[#4da7a5]",
    "pink-purple": "bg-gradient-to-r from-[#d65db1] to-[#9c60ff] hover:from-[#c44ca0] hover:to-[#8d56e6]",
    "blue-purple": "bg-gradient-to-r from-[#5E8AB8] to-[#9c60ff] hover:from-[#4d79a7] hover:to-[#8d56e6]"
  }[gradient];

  return (
    <Button
      className={cn(
        gradientClass,
        "text-white font-medium shadow-sm transition-all",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * ActionButton component for secondary actions in the Lead Radar design system
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
        "font-medium border border-gray-200 shadow-sm transition-all",
        variant === "outline" && "hover:border-[#d65db1]/30 hover:text-[#d65db1]",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * TabsNav component for pill-style tab navigation in the Lead Radar design system
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
    <div className={cn("flex bg-white rounded-full p-1 border shadow-sm overflow-x-auto", className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          className={cn(
            "rounded-full text-gray-700 flex items-center px-4 whitespace-nowrap",
            activeTab === tab.id && "bg-white shadow-sm"
          )}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

/**
 * NavItem component for top navigation items in the Lead Radar design system
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
          "text-gray-700 font-medium px-2 py-1 h-auto flex items-center",
          active && "text-[#d65db1]",
          className
        )}
        onClick={onClick}
      >
        {icon && <span className="mr-1">{icon}</span>}
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
            className="ml-1 opacity-60 h-4 w-4"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </Button>
      
      {children && (
        <div className="absolute left-0 mt-1 w-48 bg-white border rounded-md shadow-lg p-2 invisible group-hover:visible z-50">
          {children}
        </div>
      )}
    </div>
  );
}