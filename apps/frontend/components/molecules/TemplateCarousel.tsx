'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { TEMPLATES } from '@/lib/templates';
import { MiniSlidePreview } from '@/components/atoms/MiniSlidePreview';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Template } from '@/lib/templates';

export interface TemplateCarouselProps {
  onSelectTemplate?: (template: Template) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showUseButton?: boolean;
}

export function TemplateCarousel({
  onSelectTemplate,
  autoPlay = true,
  autoPlayInterval = 3000,
  showUseButton = true
}: TemplateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TEMPLATES.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + TEMPLATES.length) % TEMPLATES.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TEMPLATES.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTemplate = TEMPLATES[currentIndex];
  const firstSlide = currentTemplate.slides[0];

  return (
    <div
      className="w-full mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel container */}
      <div className="relative group">
        {/* Main slide display - Browser-like wrapper */}
        <div className="relative bg-bg-white border-2 border-border-dark rounded-2xl shadow-[8px_8px_0px_0px_#0f0f0f] overflow-hidden">
          {/* Browser-like header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-border-dark bg-bg-cream">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="max-w-xs mx-auto h-6 bg-bg-white rounded-lg border border-border flex items-center px-3">
                <span className="text-xs text-text-muted truncate">{currentTemplate.title}</span>
              </div>
            </div>
          </div>

          {/* Slide preview */}
          <div className="flex justify-center items-center p-8 md:p-12 bg-gradient-to-br from-bg-cream to-bg-white min-h-[400px] md:min-h-[500px]">
            <div className="relative w-full max-w-4xl">
              <MiniSlidePreview
                slide={firstSlide}
                theme={currentTemplate.theme}
                scale={0.5}
              />
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            type="button"
            onClick={goToPrevious}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full',
              'bg-white hover:bg-bg-cream shadow-lg border-2 border-border-dark',
              'transition-all duration-200 opacity-0 group-hover:opacity-100',
              'hover:scale-110 hover:shadow-[4px_4px_0px_0px_#0f0f0f]'
            )}
            aria-label="Previous template"
          >
            <ChevronLeft className="w-6 h-6 text-text-primary" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full',
              'bg-white hover:bg-bg-cream shadow-lg border-2 border-border-dark',
              'transition-all duration-200 opacity-0 group-hover:opacity-100',
              'hover:scale-110 hover:shadow-[4px_4px_0px_0px_#0f0f0f]'
            )}
            aria-label="Next template"
          >
            <ChevronRight className="w-6 h-6 text-text-primary" />
          </button>
        </div>

        {/* Template info */}
        <div className="mt-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-pink/10 border border-accent-pink/20 rounded-full">
            <span className="text-sm font-semibold text-accent-pink">
              {currentTemplate.category.charAt(0).toUpperCase() + currentTemplate.category.slice(1)}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
            {currentTemplate.title}
          </h3>
          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
            {currentTemplate.description}
          </p>
          {showUseButton && onSelectTemplate && (
            <button
              type="button"
              onClick={() => onSelectTemplate(currentTemplate)}
              className={cn(
                'mt-4 px-8 py-3 rounded-xl font-bold text-base',
                'bg-accent-pink text-white border-2 border-border-dark',
                'shadow-[3px_3px_0px_0px_#0f0f0f]',
                'hover:shadow-[5px_5px_0px_0px_#0f0f0f]',
                'hover:translate-x-[-2px] hover:translate-y-[-2px]',
                'transition-all duration-200'
              )}
            >
              Use This Template
            </button>
          )}
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {TEMPLATES.map((template, index) => (
            <button
              key={template.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'bg-accent-pink w-10'
                  : 'bg-border-light hover:bg-border-dark w-2'
              )}
              aria-label={`Go to ${template.title}`}
            />
          ))}
        </div>

        {/* Template counter */}
        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-text-primary">
            {currentIndex + 1} <span className="text-text-muted">of</span> {TEMPLATES.length}
          </span>
        </div>
      </div>
    </div>
  );
}
