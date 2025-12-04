'use client';

import { cn } from '@/lib/utils/cn';
import { THEMES } from '@/lib/themes';
import { MiniSlidePreview } from './MiniSlidePreview';
import type { Template as OldTemplate } from '@/lib/templates';
import type { Template as APITemplate, TemplateListItem } from '@/lib/types/template';
import { Eye, TrendingUp } from 'lucide-react';

// Support both old client-side templates and new API templates
type Template = OldTemplate | APITemplate | TemplateListItem;

export interface TemplateCardProps {
  template: Template;
  onClick: (template: Template) => void;
  onPreview?: (template: Template) => void;
}

// Type guard for API template (has 'slides' array with slide_type)
function isAPITemplate(template: Template): template is APITemplate {
  return 'slides' in template && Array.isArray(template.slides) &&
         template.slides.length > 0 && 'slide_type' in template.slides[0];
}

// Type guard for template list item (has slide_count instead of slides)
function isTemplateListItem(template: Template): template is TemplateListItem {
  return 'slide_count' in template && !('slides' in template);
}

// Type guard for old template
function isOldTemplate(template: Template): template is OldTemplate {
  return 'samplePrompt' in template;
}

export function TemplateCard({ template, onClick, onPreview }: TemplateCardProps) {
  const theme = THEMES[template.theme];

  // Get the first slide for preview (or create a placeholder)
  const getFirstSlide = () => {
    if (isTemplateListItem(template)) {
      // For list items, we don't have slides - create a placeholder
      return {
        slide_type: 'title' as const,
        placeholder_title: template.name,
        layout: 'center' as const,
        order: 1,
        id: 0,
        placeholder_body: null,
        placeholder_bullets: null,
        ai_instructions: template.description,
        is_required: true,
      };
    }
    if (isAPITemplate(template)) {
      return template.slides[0];
    }
    if (isOldTemplate(template)) {
      return template.slides[0];
    }
    return null;
  };

  const firstSlide = getFirstSlide();

  // Get template name and description
  const name = isOldTemplate(template) ? template.title : template.name;
  const description = template.description;

  // Get slide count
  const slideCount = isTemplateListItem(template)
    ? template.slide_count
    : 'slides' in template
      ? template.slides.length
      : 0;

  // Get usage count for API templates
  const usageCount = 'usage_count' in template ? template.usage_count : 0;

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
        {firstSlide && (
          <MiniSlidePreview slide={firstSlide} theme={template.theme} scale={0.18} />
        )}

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
          {slideCount} slides
        </div>

        {/* Usage count badge (for popular templates) */}
        {usageCount > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-accent-pink/90 rounded text-[10px] font-medium text-white">
            <TrendingUp className="w-3 h-3" />
            {usageCount}
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-3 bg-bg-white border-t-2 border-border-light">
        <h3 className="font-semibold text-sm text-text-primary truncate">
          {name}
        </h3>
        <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
          {description}
        </p>
      </div>
    </div>
  );
}
