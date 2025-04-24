import * as React from "react"

import { cn } from "@/lib/utils"

type CardVariant = 'default' | 'dark' | 'light' | 'navy' | 'primary';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const cardVariants: Record<CardVariant, string> = {
  default: "bg-white border-gray-200 text-gray-900",
  dark: "bg-gray-900 text-white border-gray-800",
  light: "bg-white text-gray-900 border-gray-200",
  navy: "bg-navy-800 text-white border-navy-700",
  primary: "bg-primary text-primary-foreground border-primary-700"
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border shadow-sm",
        cardVariants[variant],
        className
      )}
      data-card-variant={variant}
      {...props}
    />
  )
);
Card.displayName = "Card"

interface CardComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardComponentProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader"

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: CardVariant;
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, variant, ...props }, ref) => {
    // Get the variant from the closest Card component
    const cardVariant = variant || (props as any)['data-card-variant'] || 'default';
    
    return (
      <h3
        ref={ref}
        className={cn(
          "text-2xl font-semibold leading-none tracking-tight",
          cardVariant === 'dark' || cardVariant === 'navy' || cardVariant === 'primary' 
            ? "text-white" 
            : "text-gray-900",
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle"

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: CardVariant;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, variant, ...props }, ref) => {
    // Get the variant from the closest Card component
    const cardVariant = variant || (props as any)['data-card-variant'] || 'default';
    
    return (
      <p
        ref={ref}
        className={cn(
          "text-sm",
          cardVariant === 'dark' || cardVariant === 'navy' || cardVariant === 'primary' 
            ? "text-gray-300" 
            : "text-gray-600",
          className
        )}
        {...props}
      />
    );
  }
);
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardComponentProps>(
  ({ className, variant, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("p-6 pt-0", className)} 
      {...props} 
    />
  )
);
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardComponentProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
