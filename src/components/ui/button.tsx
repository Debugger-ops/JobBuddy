// app/components/ui/button.tsx
import * as React from "react";
import { cn } from "@/lib/utils"; // Tailwind classnames combiner

export type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";
export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "cta"
  | "heroOutline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

// Variant class definitions for each ButtonVariant
const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-gray-500 text-white hover:bg-gray-600",
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-green-500 text-white hover:bg-green-600",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  cta: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50",
  heroOutline:
    "border-2 border-white text-white bg-transparent hover:bg-white hover:text-black",
};

// Size class definitions
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-lg",
  icon: "h-10 w-10 p-0",
};

// Main Button component
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Utility function for programmatically getting classes
export const buttonVariants = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md"
) => cn(baseStyles, variantClasses[variant], sizeClasses[size]);