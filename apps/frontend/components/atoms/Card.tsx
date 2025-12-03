"use client";

import { type HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const cardVariants = cva(
  [
    "bg-bg-white rounded-2xl",
    "transition-all duration-200",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-2 border-border-dark",
          "shadow-[2px_2px_0px_0px_#0f0f0f]",
        ],
        interactive: [
          "border-2 border-border-dark",
          "shadow-[2px_2px_0px_0px_#0f0f0f]",
          "hover:-translate-x-0.5 hover:-translate-y-0.5",
          "hover:shadow-[4px_4px_0px_0px_#0f0f0f]",
          "cursor-pointer",
        ],
        flat: [
          "border border-border",
        ],
        ghost: [
          "bg-transparent",
        ],
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
