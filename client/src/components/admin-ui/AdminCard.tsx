import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  footer?: ReactNode;
}

/**
 * AdminCard component following the NextMonth Gold UI design system
 */
export function AdminCard({ children, className, title, icon, footer }: AdminCardProps) {
  return (
    <div className={cn(
      "dark:bg-[#0A0A0A] bg-white dark:border-[#1D1D1D] border-gray-200 rounded-xl shadow-md overflow-hidden",
      className
    )}>
      {(title || icon) && (
        <div className="px-6 py-5 border-b dark:border-[#1D1D1D] border-gray-200">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A] text-white">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="font-semibold text-lg dark:text-[#F9F9F9] text-gray-900">
                {title}
              </h3>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="flex items-center justify-between p-6 pt-0 mt-4 border-t dark:border-[#3A3A3A] border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}

/**
 * StatCard component for displaying statistics with the NextMonth Gold UI design
 */
export function StatCard({
  title,
  value,
  suffix,
  icon,
  description
}: {
  title: string;
  value: string | number;
  suffix?: string;
  icon?: ReactNode;
  description?: string;
}) {
  return (
    <div className="dark:bg-[#0A0A0A] bg-white dark:border-[#1D1D1D] border-gray-200 p-5 rounded-xl shadow-md relative overflow-hidden group hover:dark:border-[#3A3A3A] hover:border-gray-300 transition-all duration-300">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        {icon && React.cloneElement(icon as React.ReactElement, { className: 'h-16 w-16 text-[#F65C9A]' })}
      </div>
      <div className="relative">
        <h3 className="dark:text-[#9E9E9E] text-gray-500 text-sm font-medium">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <span className="text-3xl font-bold dark:text-white text-gray-900">{value}</span>
          {suffix && <span className="ml-1 text-xs dark:text-[#9E9E9E] text-gray-500">{suffix}</span>}
        </div>
        {description && (
          <div className="mt-3 text-xs dark:text-[#9E9E9E] text-gray-500 flex items-center gap-1.5">
            {icon && React.cloneElement(icon as React.ReactElement, { className: 'h-3.5 w-3.5 text-[#F65C9A]' })}
            <span>{description}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * TextGradient component for gradient text following the NextMonth Gold UI design
 */
export function TextGradient({ 
  text, 
  gradient = "primary",
  className
}: { 
  text: string;
  gradient?: "primary" | "pink-teal";
  className?: string;
}) {
  const gradientClasses = {
    "primary": "from-[#3CBFAE] to-[#F65C9A]",
    "pink-teal": "from-[#3CBFAE] to-[#F65C9A]"
  };

  return (
    <span className={cn(
      `bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent`,
      className
    )}>
      {text}
    </span>
  );
}

/**
 * CreditsDisplay component for showing credits in the NextMonth Gold UI design
 */
export function CreditsDisplay({ 
  current, 
  total 
}: { 
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-4 dark:bg-[#121212] bg-gray-100 backdrop-blur-sm p-5 rounded-lg shadow-inner dark:border-[#3A3A3A] border-gray-300">
      <div className="text-sm font-medium dark:text-[#E0E0E0] text-gray-700">Credits</div>
      <div className="text-sm font-semibold tabular-nums dark:text-white text-gray-900">{current}/{total}</div>
    </div>
  );
}

/**
 * ThemeToggle component for toggling between light and dark mode
 */
export function ThemeToggle({
  isDarkTheme = false,
  toggleTheme
}: {
  isDarkTheme?: boolean;
  toggleTheme?: () => void;
}) {
  return (
    <button
      onClick={toggleTheme}
      className={`h-9 w-9 rounded-full flex items-center justify-center ${
        isDarkTheme 
          ? "bg-[#F65C9A]/20 hover:bg-[#F65C9A]/30 shadow-md" 
          : "bg-gray-200 hover:bg-gray-300 border border-gray-300 shadow-md"
      } transition-all duration-200`}
      title={`Switch to ${isDarkTheme ? "light" : "dark"} mode`}
    >
      {isDarkTheme ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-yellow-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-blue-700" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  );
}