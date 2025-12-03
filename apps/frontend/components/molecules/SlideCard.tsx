"use client";

import { cn } from "@/lib/utils/cn";
import type { Slide } from "@/lib/types";

interface SlideCardProps {
  slide: Slide;
  index: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function SlideCard({ slide, index, isActive, onClick }: SlideCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full aspect-video rounded-lg overflow-hidden",
        "border-2 transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink",
        isActive
          ? "border-accent-pink shadow-[2px_2px_0px_0px_#ff90e8]"
          : "border-border hover:border-border-dark"
      )}
    >
      {/* Mini slide preview */}
      <div className="absolute inset-0 bg-bg-cream p-3 flex flex-col justify-center">
        {slide.type === "title" && (
          <div className="text-center">
            <p className="text-xs font-bold text-text-primary truncate">
              {slide.title || "Title"}
            </p>
            {slide.subtitle && (
              <p className="text-[10px] text-text-secondary truncate mt-0.5">
                {slide.subtitle}
              </p>
            )}
          </div>
        )}

        {slide.type === "bullets" && (
          <div className="space-y-0.5">
            {slide.title && (
              <p className="text-[10px] font-semibold text-text-primary truncate">
                {slide.title}
              </p>
            )}
            <div className="space-y-0.5">
              {slide.bullets?.slice(0, 3).map((bullet, i) => (
                <p key={i} className="text-[8px] text-text-secondary truncate">
                  • {bullet}
                </p>
              ))}
            </div>
          </div>
        )}

        {slide.type === "content" && (
          <div>
            {slide.title && (
              <p className="text-[10px] font-semibold text-text-primary truncate">
                {slide.title}
              </p>
            )}
            {slide.body && (
              <p className="text-[8px] text-text-secondary line-clamp-2 mt-0.5">
                {slide.body}
              </p>
            )}
          </div>
        )}

        {slide.type === "quote" && (
          <div className="text-center px-2">
            <p className="text-[8px] text-text-secondary italic line-clamp-2">
              &ldquo;{slide.quote}&rdquo;
            </p>
          </div>
        )}

        {slide.type === "section" && (
          <div className="text-center">
            <p className="text-xs font-bold text-text-primary truncate">
              {slide.title}
            </p>
          </div>
        )}
      </div>

      {/* Slide number badge */}
      <div className="absolute bottom-1 right-1 bg-bg-dark text-text-inverse text-[8px] font-medium px-1.5 py-0.5 rounded">
        {index + 1}
      </div>
    </button>
  );
}
