"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full min-h-[200px] p-4",
            "bg-bg-white text-text-primary",
            "border-2 border-border rounded-xl",
            "placeholder:text-text-muted",
            "text-lg leading-relaxed",
            "resize-none",
            "transition-all duration-200",
            "focus:outline-none focus:border-border-dark",
            "focus:shadow-[2px_2px_0px_0px_#0f0f0f]",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
