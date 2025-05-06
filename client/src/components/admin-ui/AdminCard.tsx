import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  gradient?: boolean;
}

/**
 * AdminCard component that follows the Lead Radar design system
 */
export function AdminCard({
  title,
  description,
  footer,
  children,
  className,
  contentClassName,
  gradient = false,
  ...props
}: AdminCardProps) {
  return (
    <Card 
      className={cn(
        "border shadow-sm rounded-lg overflow-hidden", 
        gradient && "bg-gradient-to-br from-white to-gray-50",
        className
      )} 
      {...props}
    >
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-lg font-medium">{title}</CardTitle>}
          {description && <CardDescription className="text-sm text-gray-500">{description}</CardDescription>}
        </CardHeader>
      )}
      
      <CardContent className={cn("p-5", contentClassName)}>
        {children}
      </CardContent>
      
      {footer && <CardFooter className="border-t p-4">{footer}</CardFooter>}
    </Card>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  iconColor?: string;
}

/**
 * StatCard component for displaying statistics in the Lead Radar design system
 */
export function StatCard({
  title,
  value,
  suffix,
  icon,
  description,
  className,
  iconColor = "text-[#d65db1]"
}: StatCardProps) {
  return (
    <Card className={cn("border shadow-sm rounded-lg overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex flex-col">
          <div className="font-medium text-gray-700 mb-4">{title}</div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          {suffix && <div className="text-xs text-gray-500 mb-5">{suffix}</div>}
          {(icon || description) && (
            <div className="flex items-center text-xs text-gray-500">
              {icon && <span className={cn("mr-2", iconColor)}>{icon}</span>}
              {description && <span>{description}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TextGradientProps {
  text: string;
  className?: string;
  gradient?: "pink-teal" | "pink-purple" | "blue-purple";
}

/**
 * TextGradient component for displaying gradient text in the Lead Radar design system
 */
export function TextGradient({ 
  text, 
  className,
  gradient = "pink-teal" 
}: TextGradientProps) {
  const gradientClass = {
    "pink-teal": "bg-gradient-to-r from-[#d65db1] to-[#5EB8B6]",
    "pink-purple": "bg-gradient-to-r from-[#d65db1] to-[#9c60ff]",
    "blue-purple": "bg-gradient-to-r from-[#5E8AB8] to-[#9c60ff]"
  }[gradient];

  return (
    <span className={cn(
      gradientClass,
      "bg-clip-text text-transparent",
      className
    )}>
      {text}
    </span>
  );
}

export function CreditsDisplay({
  current = 0,
  total = 100,
  className
}: {
  current?: number;
  total?: number;
  className?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  
  return (
    <div className={cn("text-sm text-gray-600 bg-gray-50 rounded-full px-3 py-1 inline-flex items-center", className)}>
      Credits <span className="font-medium ml-1">{current}/{total}</span>
      <div className="relative w-16 h-1 bg-gray-200 rounded-full ml-2 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#d65db1] to-[#5EB8B6] rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}