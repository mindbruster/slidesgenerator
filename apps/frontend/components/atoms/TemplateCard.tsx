'use client';

import { cn } from '@/lib/utils/cn';
import { THEMES } from '@/lib/themes';
import { MiniSlidePreview } from './MiniSlidePreview';
import type { Template } from '@/lib/templates';
import { Eye } from 'lucide-react';

export interface TemplateCardProps {
  template: Template;
  onClick: (template: Template) => void;
  onPreview?: (template: Template) => void;
}

export function TemplateCard({ template, onClick, onPreview }: TemplateCardProps) {
  const theme = THEMES[template.theme];
  const firstSlide = template.slides[0];

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(template);
  };

  return (
    <div
      className={cn(
        'group relative rounded-xl border-2 transition-all duration-200 overflow-hidden cursor-pointer',
        'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#0f0f0f]',
        'border-border-dark shadow-[2px_2px_0px_0px_#0f0f0f]'
      )}
      onClick={() => onClick(template)}
    >
      {/* Preview area showing first slide */}
      <div className="relative overflow-hidden bg-gray-100">
        <MiniSlidePreview slide={firstSlide} theme={template.theme} scale={0.18} />

        {/* Hover overlay with preview button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={handlePreviewClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-text-primary shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {/* Theme badge */}
        <div
          className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: theme.colors.accent,
            color: theme.name === 'terminal' || theme.name === 'dark' ? theme.colors.background : '#fff',
          }}
        >
          {theme.display_name}
        </div>

        {/* Slide count badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[10px] font-medium text-white">
          {template.slides.length} slides
        </div>
      </div>

      {/* Info area */}
      <div className="p-3 bg-bg-white border-t-2 border-border-light">
        <h3 className="font-semibold text-sm text-text-primary truncate">
          {template.title}
        </h3>
        <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
          {template.description}
        </p>
      </div>
    </div>
  );
}
