'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button, MiniSlidePreview } from '@/components/atoms';
import { THEMES } from '@/lib/themes';
import type { Template } from '@/lib/templates';
import { cn } from '@/lib/utils/cn';

interface TemplatePreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: Template) => void;
}

export function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}: TemplatePreviewModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !template) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentSlide((p) => Math.max(0, p - 1));
      if (e.key === 'ArrowRight') setCurrentSlide((p) => Math.min(template.slides.length - 1, p + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, template, onClose]);

  if (!mounted || !isOpen || !template) return null;

  const theme = THEMES[template.theme];
  const slide = template.slides[currentSlide];

  const handleUse = () => {
    onUseTemplate(template);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl mx-4 bg-bg-white rounded-2xl border-2 border-border-dark shadow-[4px_4px_0px_0px_#0f0f0f] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-border-light">
          <div>
            <h2 className="text-lg font-bold text-text-primary">{template.title}</h2>
            <p className="text-sm text-text-muted">{template.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleUse}>
              <Sparkles className="w-4 h-4" />
              Use This Template
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex">
          {/* Slide thumbnails */}
          <div className="w-48 border-r-2 border-border-light p-3 space-y-2 max-h-[70vh] overflow-y-auto bg-bg-secondary">
            {template.slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={cn(
                  'w-full rounded-lg overflow-hidden border-2 transition-all',
                  currentSlide === i
                    ? 'border-accent-pink shadow-[2px_2px_0px_0px_#ff90e8]'
                    : 'border-border-light hover:border-border-dark'
                )}
              >
                <div className="relative">
                  <MiniSlidePreview slide={s} theme={template.theme} scale={0.1} />
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[9px] font-medium text-white">
                    {i + 1}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Main slide preview */}
          <div className="flex-1 p-6 bg-bg-tertiary">
            <div className="relative flex items-center justify-center">
              {/* Navigation arrows */}
              <button
                onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
                disabled={currentSlide === 0}
                className={cn(
                  'absolute left-0 z-10 p-2 rounded-full bg-white border-2 border-border-dark shadow-md',
                  'hover:bg-bg-tertiary transition-colors',
                  'disabled:opacity-30 disabled:cursor-not-allowed'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Slide */}
              <div
                className="rounded-xl overflow-hidden border-2"
                style={{
                  borderColor: theme.colors.border_dark,
                  boxShadow: theme.style.shadow
                    ? theme.style.shadow.includes('rgba')
                      ? theme.style.shadow
                      : `${theme.style.shadow} ${theme.colors.border_dark}`
                    : '4px 4px 0px 0px #0f0f0f',
                }}
              >
                <MiniSlidePreview slide={slide} theme={template.theme} scale={0.5} />
              </div>

              <button
                onClick={() => setCurrentSlide((p) => Math.min(template.slides.length - 1, p + 1))}
                disabled={currentSlide === template.slides.length - 1}
                className={cn(
                  'absolute right-0 z-10 p-2 rounded-full bg-white border-2 border-border-dark shadow-md',
                  'hover:bg-bg-tertiary transition-colors',
                  'disabled:opacity-30 disabled:cursor-not-allowed'
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Slide info */}
            <div className="mt-4 text-center">
              <p className="text-sm text-text-muted">
                Slide {currentSlide + 1} of {template.slides.length}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1">
                {template.slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      currentSlide === i ? 'bg-accent-pink' : 'bg-border-light hover:bg-border-dark'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t-2 border-border-light bg-bg-secondary">
          <div className="flex items-center gap-4">
            <div
              className="px-3 py-1 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: theme.colors.accent + '20',
                color: theme.colors.accent,
              }}
            >
              Theme: {theme.display_name}
            </div>
            <span className="text-sm text-text-muted">
              {template.slides.length} slides
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Press arrow keys to navigate, Esc to close
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
