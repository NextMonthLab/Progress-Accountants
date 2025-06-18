import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Modern UI design system - solid colors with subtle styling
        "teal-blue": 
          "bg-blue-50 text-blue-600 border border-blue-100",
        "pink-coral": 
          "bg-indigo-50 text-indigo-600 border border-indigo-100",
        // NextMonth Gold UI specialized variants - modernized
        "teal-tag": 
          "bg-teal-50 text-teal-600 border border-teal-100",
        
        // Legacy badge variants mapped to modern styling (for backward compatibility)
        "new": 
          "bg-indigo-50 text-indigo-600 border border-indigo-100",
        "updated": 
          "bg-blue-50 text-blue-600 border border-blue-100",
        "beta": 
          "bg-teal-50 text-teal-600 border border-teal-100",
        "pro": 
          "bg-purple-50 text-purple-600 border border-purple-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
