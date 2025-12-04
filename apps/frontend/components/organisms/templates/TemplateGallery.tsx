'use client';

import { useState, useEffect } from 'react';
import { TemplateCard } from '@/components/atoms';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { cn } from '@/lib/utils/cn';
import type { Template as APITemplate, TemplateListItem, TemplateCategory } from '@/lib/types/template';
import type { Template as OldTemplate } from '@/lib/templates';

// Support both old and new template types
type Template = APITemplate;
import { TemplateRepository } from '@/lib/api/repositories';
import {
  Briefcase,
  GraduationCap,
  Palette,
  Cpu,
  User,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Megaphone,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const CATEGORY_ICONS: Record<TemplateCategory | 'all', React.ElementType> = {
  all: LayoutGrid,
  business: Briefcase,
  education: GraduationCap,
  creative: Palette,
  technology: Cpu,
  personal: User,
  marketing: Megaphone,
};

const CATEGORY_LABELS: Record<TemplateCategory | 'all', string> = {
  all: 'All',
  business: 'Business',
  education: 'Education',
  creative: 'Creative',
  technology: 'Technology',
  personal: 'Personal',
  marketing: 'Marketing',
};

const TEMPLATES_PER_ROW = 4;

export interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function TemplateGallery({
  onSelectTemplate,
  isCollapsed = false,
  onToggleCollapse,
}: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates from API
  useEffect(() => {
    async function fetchTemplates() {
      setIsLoading(true);
      setError(null);
      try {
        const category = selectedCategory === 'all' ? undefined : selectedCategory;
        const data = await TemplateRepository.list({ category });
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplates();
  }, [selectedCategory]);

  // Get available categories
  const categories: (TemplateCategory | 'all')[] = [
    'all',
    'business',
    'marketing',
    'education',
    'technology',
    'creative',
    'personal',
  ];

  // Show only first row when not expanded
  const visibleTemplates = isExpanded
    ? templates
    : templates.slice(0, TEMPLATES_PER_ROW);

  const hasMoreTemplates = templates.length > TEMPLATES_PER_ROW;
  const remainingCount = templates.length - TEMPLATES_PER_ROW;

  const handleSelectTemplate = async (template: TemplateListItem | Template) => {
    // If it's a list item, fetch the full template first
    if ('slide_count' in template && !('slides' in template)) {
      try {
        const fullTemplate = await TemplateRepository.getById(template.id);
        onSelectTemplate(fullTemplate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
      }
    } else {
      onSelectTemplate(template as Template);
    }
  };

  const handlePreviewTemplate = async (template: TemplateListItem | Template) => {
    // If it's a list item, fetch the full template for preview
    if ('slide_count' in template && !('slides' in template)) {
      try {
        const fullTemplate = await TemplateRepository.getById(template.id);
        setPreviewTemplate(fullTemplate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template preview');
      }
    } else {
      setPreviewTemplate(template as Template);
    }
  };

  const handleUseTemplateFromModal = (template: OldTemplate | APITemplate) => {
    // Only pass API templates to the parent - the modal might have old templates too
    onSelectTemplate(template as Template);
  };

  const handleRetry = () => {
    setSelectedCategory(selectedCategory); // Trigger re-fetch
  };

  return (
    <div className="space-y-4">
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Start with a template</h2>
          {!isCollapsed && (
            <p className="text-sm text-text-secondary mt-1">
              Choose a template to get started quickly
            </p>
          )}
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
              'border-border-light hover:border-border-dark hover:bg-bg-tertiary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink'
            )}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Templates
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Templates
              </>
            )}
          </button>
        )}
      </div>

      {/* Collapsible content */}
      {!isCollapsed && (
        <>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category];
              return (
                <CategoryButton
                  key={category}
                  category={category}
                  label={CATEGORY_LABELS[category]}
                  icon={Icon}
                  isSelected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                />
              );
            })}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent-pink" />
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                  'border-border-dark bg-bg-white text-text-primary',
                  'hover:bg-accent-pink-light hover:shadow-[2px_2px_0px_0px_#0f0f0f]'
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && templates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted">
              <LayoutGrid className="w-12 h-12 mb-4 opacity-50" />
              <p>No templates found in this category</p>
            </div>
          )}

          {/* Template grid */}
          {!isLoading && !error && templates.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visibleTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => handleSelectTemplate(template)}
                    onPreview={() => handlePreviewTemplate(template)}
                  />
                ))}
              </div>

              {/* Show more / Show less button */}
              {hasMoreTemplates && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                      'flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all',
                      'border-border-dark bg-bg-white text-text-primary',
                      'hover:bg-accent-pink-light hover:shadow-[2px_2px_0px_0px_#0f0f0f]',
                      'active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink'
                    )}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show {remainingCount} more templates
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleUseTemplateFromModal}
      />
    </div>
  );
}

interface CategoryButtonProps {
  category: TemplateCategory | 'all';
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryButton({ label, icon: Icon, isSelected, onClick }: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2',
        isSelected
          ? 'bg-bg-dark text-text-inverse border-border-dark shadow-[2px_2px_0px_0px_#ff90e8]'
          : 'bg-bg-white text-text-primary border-border-light hover:border-border-dark hover:bg-bg-tertiary'
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
