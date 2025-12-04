'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { THEMES } from '@/lib/themes';
import { MiniSlidePreview } from '@/components/atoms/MiniSlidePreview';
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  getAllCategories,
  type Template,
  type TemplateCategory,
} from '@/lib/templates';
import {
  Briefcase,
  GraduationCap,
  Palette,
  Cpu,
  User,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { TemplatePreviewModal } from './TemplatePreviewModal';

const CATEGORY_ICONS: Record<TemplateCategory | 'all', React.ElementType> = {
  all: LayoutGrid,
  business: Briefcase,
  education: GraduationCap,
  creative: Palette,
  technology: Cpu,
  personal: User,
};

export interface TemplateSidebarProps {
  onSelectTemplate: (template: Template) => void;
  selectedTemplate: Template | null;
}

export function TemplateSidebar({ onSelectTemplate, selectedTemplate }: TemplateSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = getAllCategories();
  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template);
    setIsCollapsed(true); // Auto-collapse sidebar after selecting a template
  };

  const handlePreviewTemplate = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewTemplate(template);
  };

  if (isCollapsed) {
    return (
      <div className="hidden md:flex w-12 border-r-2 border-border-dark bg-bg-white flex-col items-center py-4">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
          title="Expand templates"
        >
          <ChevronRight className="w-5 h-5 text-text-primary" />
        </button>
        <div className="mt-4 space-y-2">
          {categories.slice(0, 5).map((category) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsCollapsed(false);
                }}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  selectedCategory === category
                    ? 'bg-accent-pink-light'
                    : 'hover:bg-bg-tertiary'
                )}
                title={TEMPLATE_CATEGORIES[category].label}
              >
                <Icon className="w-4 h-4 text-text-primary" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:flex w-72 border-r-2 border-border-dark bg-bg-white flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b-2 border-border-light flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Templates</h2>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        {/* Category filters */}
        <div className="p-3 border-b-2 border-border-light">
          <div className="flex flex-wrap gap-1.5">
            <CategoryPill
              label="All"
              icon={CATEGORY_ICONS.all}
              isSelected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            />
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category];
              return (
                <CategoryPill
                  key={category}
                  label={TEMPLATE_CATEGORIES[category].label}
                  icon={Icon}
                  isSelected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                />
              );
            })}
          </div>
        </div>

        {/* Template list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filteredTemplates.map((template) => (
            <SidebarTemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onClick={() => handleSelectTemplate(template)}
              onPreview={(e) => handlePreviewTemplate(template, e)}
            />
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleSelectTemplate}
      />
    </>
  );
}

interface CategoryPillProps {
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryPill({ label, icon: Icon, isSelected, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink',
        isSelected
          ? 'bg-bg-dark text-text-inverse'
          : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}

interface SidebarTemplateCardProps {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
  onPreview: (e: React.MouseEvent) => void;
}

function SidebarTemplateCard({ template, isSelected, onClick, onPreview }: SidebarTemplateCardProps) {
  const theme = THEMES[template.theme];
  const firstSlide = template.slides[0];

  return (
    <div
      className={cn(
        'group relative rounded-lg border-2 transition-all duration-200 overflow-hidden cursor-pointer',
        isSelected
          ? 'border-accent-pink shadow-[2px_2px_0px_0px_#ff90e8]'
          : 'border-border-light hover:border-border-dark hover:shadow-[2px_2px_0px_0px_#0f0f0f]'
      )}
      onClick={onClick}
    >
      {/* Preview area */}
      <div className="relative overflow-hidden bg-gray-100">
        <MiniSlidePreview slide={firstSlide} theme={template.theme} scale={0.14} />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={onPreview}
            className="flex items-center gap-1 px-2 py-1 bg-white rounded text-xs font-medium text-text-primary shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-3 h-3" />
            Preview
          </button>
        </div>

        {/* Theme badge */}
        <div
          className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: theme.colors.accent,
            color: theme.name === 'terminal' || theme.name === 'dark' ? theme.colors.background : '#fff',
          }}
        >
          {theme.display_name}
        </div>

        {/* Slide count badge */}
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/60 rounded text-[9px] font-medium text-white">
          {template.slides.length} slides
        </div>
      </div>

      {/* Info area */}
      <div className="p-2 bg-bg-white">
        <h3 className="font-semibold text-xs text-text-primary truncate">
          {template.title}
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">
          {template.description}
        </p>
      </div>
    </div>
  );
}
