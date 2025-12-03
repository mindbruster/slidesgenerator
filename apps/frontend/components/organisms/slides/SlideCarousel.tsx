"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { SlideCard } from "@/components/molecules";
import type { Slide } from "@/lib/types";

interface SlideCarouselProps {
  slides: Slide[];
  currentIndex: number;
  onSlideSelect: (index: number) => void;
}

export function SlideCarousel({
  slides,
  currentIndex,
  onSlideSelect,
}: SlideCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active slide
  useEffect(() => {
    if (scrollRef.current) {
      const activeSlide = scrollRef.current.children[currentIndex] as HTMLElement;
      if (activeSlide) {
        activeSlide.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  return (
    <div className="w-full bg-bg-white border-t-2 border-border-dark">
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-3 p-4 overflow-x-auto",
          "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        )}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="flex-shrink-0 w-32">
            <SlideCard
              slide={slide}
              index={index}
              isActive={index === currentIndex}
              onClick={() => onSlideSelect(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
