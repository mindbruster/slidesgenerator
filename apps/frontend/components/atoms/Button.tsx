"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold transition-all duration-200",
    "border-2 border-border-dark",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-bg-dark text-text-inverse",
          "shadow-[2px_2px_0px_0px_#0f0f0f]",
          "hover:bg-accent-pink hover:text-text-primary",
          "hover:-translate-x-0.5 hover:-translate-y-0.5",
          "hover:shadow-[4px_4px_0px_0px_#0f0f0f]",
          "active:translate-x-0 active:translate-y-0",
          "active:shadow-[1px_1px_0px_0px_#0f0f0f]",
        ],
        secondary: [
          "bg-bg-white text-text-primary",
          "hover:bg-accent-pink-light",
        ],
        ghost: [
          "border-transparent",
          "bg-transparent text-text-secondary",
          "hover:bg-bg-white hover:text-text-primary",
        ],
        danger: [
          "bg-error text-text-inverse border-error",
          "hover:bg-red-600",
        ],
      },
      size: {
        sm: "px-3 py-1.5 text-sm rounded-lg",
        md: "px-4 py-2.5 text-base rounded-xl",
        lg: "px-6 py-3.5 text-lg rounded-xl",
        icon: "p-2.5 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
