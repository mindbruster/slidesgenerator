'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { THEMES } from '@/lib/themes';
import type { TemplateCategory, TemplateListItem, Template as APITemplate } from '@/lib/types/template';
import { TemplateRepository } from '@/lib/api/repositories';
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
  Heart,
  DollarSign,
  TrendingUp,
  HandHeart,
  Loader2,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { MiniSlidePreview } from '@/components/atoms/MiniSlidePreview';

type Template = APITemplate;

const CATEGORY_ICONS: Record<TemplateCategory | 'all', React.ElementType> = {
  all: LayoutGrid,
  business: Briefcase,
  marketing: Megaphone,
  education: GraduationCap,
  creative: Palette,
  technology: Cpu,
  personal: User,
  healthcare: Heart,
  finance: DollarSign,
  sales: TrendingUp,
  nonprofit: HandHeart,
};

const CATEGORY_LABELS: Record<TemplateCategory | 'all', string> = {
  all: 'All',
  business: 'Business',
  marketing: 'Marketing',
  education: 'Education',
  creative: 'Creative',
  technology: 'Technology',
  personal: 'Personal',
  healthcare: 'Healthcare',
  finance: 'Finance',
  sales: 'Sales',
  nonprofit: 'Nonprofit',
};

const CATEGORIES: (TemplateCategory | 'all')[] = [
  'all',
  'business',
  'marketing',
  'education',
  'technology',
  'creative',
  'personal',
  'healthcare',
  'finance',
  'sales',
  'nonprofit',
];

export interface TemplateSidebarProps {
  onSelectTemplate: (template: Template) => void;
  selectedTemplate: Template | null;
}

export function TemplateSidebar({ onSelectTemplate, selectedTemplate }: TemplateSidebarProps) {
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates from API
  useEffect(() => {
    async function fetchTemplates() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await TemplateRepository.list({});
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<TemplateCategory, TemplateListItem[]>);

  // Handle template selection
  const handleSelectTemplate = async (template: TemplateListItem | Template) => {
    // If it's a list item, fetch the full template first
    if ('slide_count' in template && !('slides' in template)) {
      try {
        const fullTemplate = await TemplateRepository.getById(template.id);
        onSelectTemplate(fullTemplate);
        setIsCollapsed(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
      }
    } else {
      onSelectTemplate(template as Template);
      setIsCollapsed(true);
    }
  };

  const handlePreviewTemplate = async (template: TemplateListItem | Template, e: React.MouseEvent) => {
    e.stopPropagation();
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
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:flex w-72 border-r-2 border-border-dark bg-bg-white flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b-2 border-border-light flex items-center justify-between bg-bg-white sticky top-0 z-10">
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-accent-pink" />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-text-secondary">{error}</p>
          </div>
        )}

        {/* Template list organized by category */}
        {!isLoading && !error && (
          <div className="flex-1 overflow-y-auto">
            {CATEGORIES.filter((c) => c !== 'all' && templatesByCategory[c]?.length > 0).map((category) => {
              const Icon = CATEGORY_ICONS[category];
              const categoryTemplates = templatesByCategory[category] || [];

              return (
                <div key={category} className="mb-2">
                  {/* Sticky category header */}
                  <div className="sticky top-0 bg-bg-white border-b-2 border-border-light px-4 py-2.5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-text-primary" />
                      <h3 className="font-semibold text-sm text-text-primary">
                        {CATEGORY_LABELS[category]}
                      </h3>
                    </div>
                    <span className="text-xs font-medium text-text-muted bg-bg-tertiary px-2 py-0.5 rounded-full">
                      {categoryTemplates.length}
                    </span>
                  </div>

                  {/* Templates in this category */}
                  <div className="p-3 space-y-3">
                    {categoryTemplates.map((template) => (
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
              );
            })}
          </div>
        )}
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

interface SidebarTemplateCardProps {
  template: TemplateListItem;
  isSelected: boolean;
  onClick: () => void;
  onPreview: (e: React.MouseEvent) => void;
}

function SidebarTemplateCard({ template, isSelected, onClick, onPreview }: SidebarTemplateCardProps) {
  const theme = THEMES[template.theme];
  const [fullTemplate, setFullTemplate] = useState<Template | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Load the first slide for preview
  useEffect(() => {
    async function loadPreview() {
      if (!fullTemplate && !isLoadingPreview) {
        setIsLoadingPreview(true);
        try {
          const data = await TemplateRepository.getById(template.id);
          setFullTemplate(data);
        } catch (err) {
          console.error('Failed to load template preview:', err);
        } finally {
          setIsLoadingPreview(false);
        }
      }
    }
    loadPreview();
  }, [template.id, fullTemplate, isLoadingPreview]);

  return (
    <div
      className={cn(
        'group relative rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden',
        isSelected
          ? 'border-accent-pink shadow-[2px_2px_0px_0px_#ff90e8] bg-bg-white'
          : 'border-border-light hover:border-border-dark hover:shadow-[2px_2px_0px_0px_#0f0f0f] bg-bg-white'
      )}
      onClick={onClick}
    >
      {/* Slide Preview */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2">
        {fullTemplate?.slides?.[0] ? (
          <div className="transform scale-95">
            <MiniSlidePreview
              slide={fullTemplate.slides[0]}
              theme={template.theme}
              scale={0.12}
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center rounded"
            style={{
              width: '230px',
              height: '130px',
              background: theme.style.background_gradient || theme.colors.background,
            }}
          >
            {isLoadingPreview && (
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: theme.colors.text_secondary }} />
            )}
          </div>
        )}

        {/* Preview button overlay - only show on hover */}
        <button
          type="button"
          onClick={onPreview}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
          title="Preview"
        >
          <Eye className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {/* Template info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-text-primary line-clamp-1 mb-1">
          {template.name}
        </h3>

        <p className="text-[10px] text-text-muted line-clamp-2 mb-2">
          {template.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          {/* Theme badge */}
          <div
            className="px-2 py-0.5 rounded-full font-medium text-[9px]"
            style={{
              backgroundColor: theme.colors.accent + '20',
              color: theme.colors.accent,
            }}
          >
            {theme.display_name}
          </div>

          {/* Slide count */}
          <div className="flex items-center gap-0.5">
            <LayoutGrid className="w-3 h-3" />
            {template.slide_count}
          </div>
        </div>
      </div>
    </div>
  );
}
