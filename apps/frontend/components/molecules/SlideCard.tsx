"use client";

import { cn } from "@/lib/utils/cn";
import type { Slide, ChartType } from "@/lib/types";

// Mini chart icon component for thumbnails
function MiniChartIcon({ chartType }: { chartType: ChartType | null | undefined }) {
  const iconClass = "w-full h-full";

  switch (chartType) {
    case "bar":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="12" width="4" height="8" rx="1" fill="#ff90e8" stroke="#0f0f0f" />
          <rect x="10" y="6" width="4" height="14" rx="1" fill="#ff90e8" stroke="#0f0f0f" />
          <rect x="17" y="9" width="4" height="11" rx="1" fill="#ff90e8" stroke="#0f0f0f" />
        </svg>
      );
    case "horizontal_bar":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="12" height="4" rx="1" fill="#ff90e8" stroke="#0f0f0f" />
          <rect x="4" y="10" width="16" height="4" rx="1" fill="#ff90e8" stroke="#0f0f0f" />
          <rect x="4" y="16" width="8" height="4" rx="1" fill="#ff90e8" stroke="#0f0f0f" />
        </svg>
      );
    case "line":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="#ff90e8" strokeWidth="2">
          <polyline points="4,18 8,12 12,15 16,8 20,10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="4" cy="18" r="2" fill="#ff90e8" stroke="#0f0f0f" />
          <circle cx="8" cy="12" r="2" fill="#ff90e8" stroke="#0f0f0f" />
          <circle cx="12" cy="15" r="2" fill="#ff90e8" stroke="#0f0f0f" />
          <circle cx="16" cy="8" r="2" fill="#ff90e8" stroke="#0f0f0f" />
          <circle cx="20" cy="10" r="2" fill="#ff90e8" stroke="#0f0f0f" />
        </svg>
      );
    case "area":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none">
          <path d="M4,20 L4,16 L8,10 L12,14 L16,6 L20,8 L20,20 Z" fill="#ff90e8" fillOpacity="0.4" stroke="#ff90e8" strokeWidth="2" />
        </svg>
      );
    case "pie":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none">
          <circle cx="12" cy="12" r="8" fill="#6b7280" stroke="#0f0f0f" strokeWidth="1.5" />
          <path d="M12,12 L12,4 A8,8 0 0,1 19.5,16 Z" fill="#ff90e8" stroke="#0f0f0f" strokeWidth="1.5" />
        </svg>
      );
    case "donut":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none">
          <circle cx="12" cy="12" r="8" fill="none" stroke="#6b7280" strokeWidth="4" />
          <path d="M12,4 A8,8 0 0,1 19.5,16" fill="none" stroke="#ff90e8" strokeWidth="4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="12" width="4" height="8" rx="1" fill="#ff90e8" stroke="#0f0f0f" />
          <rect x="10" y="6" width="4" height="14" rx="1" fill="#ff90e8" stroke="#0f0f0f" />
          <rect x="17" y="9" width="4" height="11" rx="1" fill="#ff90e8" stroke="#0f0f0f" />
        </svg>
      );
  }
}

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

        {slide.type === "chart" && (
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8">
              <MiniChartIcon chartType={slide.chart_type} />
            </div>
            <p className="text-[10px] font-semibold text-text-primary truncate w-full text-center">
              {slide.title || "Chart"}
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
