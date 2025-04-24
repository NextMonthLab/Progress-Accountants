import * as React from "react"

import { cn } from "@/lib/utils"

type CardVariant = 'default' | 'dark' | 'light' | 'navy' | 'primary';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const cardVariants: Record<CardVariant, string> = {
  default: "bg-card text-card-foreground",
  dark: "bg-gray-900 text-white",
  light: "bg-white text-gray-900",
  navy: "bg-navy-800 text-white",
  primary: "bg-primary text-primary-foreground"
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
  ({ className, variant, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle"

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: CardVariant;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, variant, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-sm",
        variant === 'dark' || variant === 'navy' || variant === 'primary' 
          ? "text-gray-300" 
          : "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
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
