'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Palette,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button, TextArea } from '@/components/atoms';
import { ThemeSelector } from '@/components/molecules/ThemeSelector';
import { MiniSlidePreview } from '@/components/atoms';
import { THEMES } from '@/lib/themes';
import { cn } from '@/lib/utils/cn';
import type { Template, TemplateSlide, TemplateGenerateRequest } from '@/lib/types/template';
import type { ThemeName } from '@/lib/types/slide';

interface TemplateCustomizerProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (templateId: number, request: TemplateGenerateRequest) => Promise<void>;
  isGenerating?: boolean;
}

interface SlideConfig {
  slide: TemplateSlide;
  isIncluded: boolean;
  customContent: string;
}

export function TemplateCustomizer({
  template,
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false,
}: TemplateCustomizerProps) {
  const [userContent, setUserContent] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(template.theme);
  const [slideConfigs, setSlideConfigs] = useState<SlideConfig[]>(() =>
    template.slides.map((slide) => ({
      slide,
      isIncluded: true,
      customContent: '',
    }))
  );
  const [showSlideSettings, setShowSlideSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle mount for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update configs when template changes
  useMemo(() => {
    setSlideConfigs(
      template.slides.map((slide) => ({
        slide,
        isIncluded: true,
        customContent: '',
      }))
    );
    setSelectedTheme(template.theme);
    setUserContent('');
    setError(null);
  }, [template.id]);

  const toggleSlideInclusion = (index: number) => {
    setSlideConfigs((prev) => {
      const newConfigs = [...prev];
      const config = newConfigs[index];

      // Don't allow excluding required slides
      if (config.slide.is_required) return prev;

      newConfigs[index] = { ...config, isIncluded: !config.isIncluded };
      return newConfigs;
    });
  };

  const includedSlideCount = slideConfigs.filter((c) => c.isIncluded).length;
  const excludedSlideIds = slideConfigs
    .filter((c) => !c.isIncluded)
    .map((c) => c.slide.id);

  const handleGenerate = async () => {
    setError(null);

    if (userContent.trim().length < 20) {
      setError('Please provide at least 20 characters describing your content.');
      return;
    }

    const request: TemplateGenerateRequest = {
      user_content: userContent.trim(),
      theme: selectedTheme !== template.theme ? selectedTheme : undefined,
      excluded_slides: excludedSlideIds.length > 0 ? excludedSlideIds : undefined,
    };

    try {
      await onGenerate(template.id, request);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate presentation');
    }
  };

  if (!mounted || !isOpen) return null;

  const theme = THEMES[selectedTheme];

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-bg-white rounded-2xl border-2 border-border-dark shadow-[4px_4px_0px_0px_#0f0f0f] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-border-light shrink-0">
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Customize: {template.name}
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              Add your content and customize the template
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* User content input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
              <FileText className="w-4 h-4" />
              Your Content
            </label>
            <p className="text-xs text-text-muted mb-3">
              Describe your topic, paste your notes, or provide key points. The AI will use this with the template structure.
            </p>
            <TextArea
              value={userContent}
              onChange={(e) => setUserContent(e.target.value)}
              placeholder={`Example: "${template.description}" - Add your specific details here...`}
              className="min-h-[150px]"
              disabled={isGenerating}
            />
            <div className="flex justify-between mt-2 text-xs text-text-muted">
              <span>{userContent.length} characters</span>
              <span>Minimum: 20 characters</span>
            </div>
          </div>

          {/* Theme selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
              <Palette className="w-4 h-4" />
              Theme
            </label>
            <p className="text-xs text-text-muted mb-3">
              Template default: {THEMES[template.theme].display_name}
            </p>
            <ThemeSelector
              value={selectedTheme}
              onChange={setSelectedTheme}
              disabled={isGenerating}
            />
          </div>

          {/* Slide customization */}
          <div>
            <button
              type="button"
              onClick={() => setShowSlideSettings(!showSlideSettings)}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                showSlideSettings
                  ? 'border-accent-pink bg-accent-pink-light'
                  : 'border-border-light hover:border-border-dark'
              )}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Eye className="w-4 h-4" />
                Customize Slides
                <span className="text-xs font-normal text-text-muted">
                  ({includedSlideCount} of {template.slides.length} slides)
                </span>
              </span>
              {showSlideSettings ? (
                <ChevronUp className="w-5 h-5 text-text-secondary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-text-secondary" />
              )}
            </button>

            {showSlideSettings && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-text-muted px-1">
                  Toggle optional slides on/off. Required slides cannot be removed.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {slideConfigs.map((config, index) => (
                    <SlideToggleCard
                      key={config.slide.id}
                      config={config}
                      index={index}
                      theme={selectedTheme}
                      onToggle={() => toggleSlideInclusion(index)}
                      disabled={isGenerating}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview section */}
          <div className="p-4 bg-bg-secondary rounded-xl border-2 border-border-light">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Generation Preview
            </h3>
            <div className="flex flex-wrap gap-3">
              <PreviewBadge
                label="Template"
                value={template.name}
                color={theme.colors.accent}
              />
              <PreviewBadge
                label="Theme"
                value={THEMES[selectedTheme].display_name}
                color={theme.colors.accent}
              />
              <PreviewBadge
                label="Slides"
                value={`${includedSlideCount} slides`}
                color={theme.colors.accent}
              />
              {excludedSlideIds.length > 0 && (
                <PreviewBadge
                  label="Excluded"
                  value={`${excludedSlideIds.length} optional`}
                  color="#ff6b6b"
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t-2 border-border-light bg-bg-secondary shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <Button
            onClick={handleGenerate}
            disabled={userContent.trim().length < 20}
            isLoading={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Presentation
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Sub-components

interface SlideToggleCardProps {
  config: SlideConfig;
  index: number;
  theme: ThemeName;
  onToggle: () => void;
  disabled?: boolean;
}

function SlideToggleCard({ config, index, theme, onToggle, disabled }: SlideToggleCardProps) {
  const { slide, isIncluded } = config;
  const isRequired = slide.is_required;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled || isRequired}
      className={cn(
        'relative rounded-lg overflow-hidden border-2 transition-all text-left',
        isIncluded
          ? 'border-border-dark shadow-[2px_2px_0px_0px_#0f0f0f]'
          : 'border-border-light opacity-60',
        isRequired && 'cursor-not-allowed',
        !isRequired && !disabled && 'hover:border-accent-pink'
      )}
    >
      {/* Mini preview */}
      <div className="relative">
        <MiniSlidePreview slide={slide} theme={theme} scale={0.12} />

        {/* Overlay for excluded slides */}
        {!isIncluded && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <EyeOff className="w-6 h-6 text-white" />
          </div>
        )}

        {/* Slide number badge */}
        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-medium text-white">
          {index + 1}
        </div>

        {/* Required badge */}
        {isRequired && (
          <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-accent-pink rounded text-[8px] font-medium text-white">
            Required
          </div>
        )}

        {/* Include/exclude indicator */}
        {!isRequired && (
          <div
            className={cn(
              'absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
              isIncluded
                ? 'bg-green-500 border-green-600'
                : 'bg-white border-gray-300'
            )}
          >
            {isIncluded && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Slide info */}
      <div className="p-2 bg-bg-white border-t border-border-light">
        <p className="text-[10px] font-medium text-text-primary truncate capitalize">
          {slide.slide_type.replace('_', ' ')}
        </p>
        {slide.placeholder_title && (
          <p className="text-[9px] text-text-muted truncate">
            {slide.placeholder_title}
          </p>
        )}
      </div>
    </button>
  );
}

interface PreviewBadgeProps {
  label: string;
  value: string;
  color: string;
}

function PreviewBadge({ label, value, color }: PreviewBadgeProps) {
  return (
    <div
      className="px-3 py-1.5 rounded-lg"
      style={{
        backgroundColor: color + '15',
        border: `1px solid ${color}40`,
      }}
    >
      <span className="text-xs text-text-muted">{label}: </span>
      <span className="text-xs font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
