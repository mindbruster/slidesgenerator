"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-2 border-border-dark rounded-xl overflow-hidden bg-bg-white shadow-[2px_2px_0px_0px_#0f0f0f]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-bg-cream transition-colors"
      >
        <span className="font-semibold text-text-primary">{question}</span>
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
            isOpen ? "bg-accent-pink" : "bg-accent-pink-light"
          )}
        >
          {isOpen ? (
            <Minus className="w-4 h-4 text-text-primary" />
          ) : (
            <Plus className="w-4 h-4 text-text-primary" />
          )}
        </div>
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 pt-0 text-text-secondary leading-relaxed border-t-2 border-border">
            <div className="pt-4">{answer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
