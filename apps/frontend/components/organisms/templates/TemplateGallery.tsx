'use client';

import { useState } from 'react';
import { TemplateCard } from '@/components/atoms';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { cn } from '@/lib/utils/cn';
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  getAllCategories,
  type Template,
  type TemplateCategory,
} from '@/lib/templates';
import { Briefcase, GraduationCap, Palette, Cpu, User, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORY_ICONS: Record<TemplateCategory | 'all', React.ElementType> = {
  all: LayoutGrid,
  business: Briefcase,
  education: GraduationCap,
  creative: Palette,
  technology: Cpu,
  personal: User,
};

const TEMPLATES_PER_ROW = 4;

export interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function TemplateGallery({ onSelectTemplate, isCollapsed = false, onToggleCollapse }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = getAllCategories();
  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  // Show only first row when not expanded
  const visibleTemplates = isExpanded
    ? filteredTemplates
    : filteredTemplates.slice(0, TEMPLATES_PER_ROW);

  const hasMoreTemplates = filteredTemplates.length > TEMPLATES_PER_ROW;
  const remainingCount = filteredTemplates.length - TEMPLATES_PER_ROW;

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template);
  };

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
  };

  const handleUseTemplateFromModal = (template: Template) => {
    onSelectTemplate(template);
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
              "flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
              "border-border-light hover:border-border-dark hover:bg-bg-tertiary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
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
            <CategoryButton
              category="all"
              label="All"
              icon={CATEGORY_ICONS.all}
              isSelected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            />
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category];
              return (
                <CategoryButton
                  key={category}
                  category={category}
                  label={TEMPLATE_CATEGORIES[category].label}
                  icon={Icon}
                  isSelected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                />
              );
            })}
          </div>

          {/* Template grid - shows 1 row initially, expands on click */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={handleSelectTemplate}
                onPreview={handlePreviewTemplate}
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
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all",
                  "border-border-dark bg-bg-white text-text-primary",
                  "hover:bg-accent-pink-light hover:shadow-[2px_2px_0px_0px_#0f0f0f]",
                  "active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
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
