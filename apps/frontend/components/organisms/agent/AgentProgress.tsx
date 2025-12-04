'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Loader2, Sparkles, Wand2, Brain, ChevronLeft, ChevronRight, ArrowRight, Plus, X, Eye, RefreshCw, Save, Palette } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { AgentEvent, Slide, ThemeName } from '@/lib/types';
import { THEMES, THEME_LIST } from '@/lib/themes';
import { SlidePreview } from '@/components/organisms/slides/SlidePreview';

interface AgentProgressProps {
  events: AgentEvent[];
  isComplete: boolean;
  theme?: ThemeName;
  totalSlides?: number;
  onViewPresentation?: () => void;
  onCreateNew?: () => void;
  onUpdateSlide?: (slideNumber: number, args: Record<string, unknown>) => void;
  onRegenerate?: (theme: ThemeName) => void;
}

function getSlideIcon(type: string) {
  switch (type) {
    case 'title':
      return '🎯';
    case 'bullets':
      return '📝';
    case 'content':
      return '📄';
    case 'quote':
      return '💬';
    case 'section':
      return '📑';
    case 'chart':
      return '📊';
    default:
      return '📋';
  }
}

function ThinkingBubble({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-10 h-10 rounded-xl bg-accent-pink/20 flex items-center justify-center flex-shrink-0">
        <Brain className="w-5 h-5 text-accent-pink" />
      </div>
      <div className="flex-1 bg-bg-white border-2 border-border rounded-2xl rounded-tl-none px-5 py-4 shadow-[2px_2px_0px_0px_#e5e5e5]">
        <p className="text-base text-text-secondary leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

interface SlideDetailModalProps {
  event: AgentEvent;
  onClose: () => void;
  onUpdate?: (slideNumber: number, args: Record<string, unknown>) => void;
}

function SlideDetailModal({ event, onClose, onUpdate }: SlideDetailModalProps) {
  const args = event.args || {};
  const slideType = args.slide_type as string || 'content';

  // Local state for editing
  const [editedArgs, setEditedArgs] = useState<Record<string, unknown>>({ ...args });
  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (field: string, value: unknown) => {
    setEditedArgs(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    // Immediately update parent to reflect in slide preview
    if (onUpdate && event.slide_number) {
      onUpdate(event.slide_number, { [field]: value });
    }
  };

  const handleBulletChange = (index: number, value: string) => {
    const bullets = [...(editedArgs.bullets as string[] || [])];
    bullets[index] = value;
    handleFieldChange('bullets', bullets);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={onClose}>
      <div
        className="bg-bg-white rounded-2xl border-2 border-border-dark shadow-[6px_6px_0px_0px_#0f0f0f] max-w-lg w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-border bg-bg-cream">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getSlideIcon(slideType)}</span>
            <div>
              <h3 className="font-bold text-text-primary">Slide {event.slide_number}</h3>
              <span className="text-xs px-2 py-0.5 bg-bg-white border border-border rounded-full text-text-muted capitalize">
                {slideType}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-xs text-accent-pink font-medium">Editing</span>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {(slideType === 'title' || slideType === 'content' || slideType === 'bullets' || slideType === 'section' || slideType === 'quote' || slideType === 'chart') && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Title</label>
              <input
                type="text"
                value={(editedArgs.title as string) || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full mt-1 px-3 py-2 text-text-primary font-medium bg-bg-cream border-2 border-border rounded-lg focus:border-accent-pink focus:outline-none transition-colors"
                placeholder="Enter title..."
              />
            </div>
          )}

          {(slideType === 'title') && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Subtitle</label>
              <input
                type="text"
                value={(editedArgs.subtitle as string) || ''}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="w-full mt-1 px-3 py-2 text-text-secondary bg-bg-cream border-2 border-border rounded-lg focus:border-accent-pink focus:outline-none transition-colors"
                placeholder="Enter subtitle..."
              />
            </div>
          )}

          {(slideType === 'content') && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Body</label>
              <textarea
                value={(editedArgs.body as string) || ''}
                onChange={(e) => handleFieldChange('body', e.target.value)}
                rows={4}
                className="w-full mt-1 px-3 py-2 text-text-secondary bg-bg-cream border-2 border-border rounded-lg focus:border-accent-pink focus:outline-none transition-colors resize-none"
                placeholder="Enter body text..."
              />
            </div>
          )}

          {(slideType === 'bullets') && editedArgs.bullets && Array.isArray(editedArgs.bullets) && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Bullet Points</label>
              <div className="mt-2 space-y-2">
                {(editedArgs.bullets as string[]).map((bullet, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-pink flex-shrink-0" />
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleBulletChange(i, e.target.value)}
                      className="flex-1 px-3 py-2 text-text-secondary bg-bg-cream border-2 border-border rounded-lg focus:border-accent-pink focus:outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(slideType === 'quote') && (
            <>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Quote</label>
                <textarea
                  value={(editedArgs.quote as string) || ''}
                  onChange={(e) => handleFieldChange('quote', e.target.value)}
                  rows={3}
                  className="w-full mt-1 px-3 py-2 text-text-secondary italic bg-bg-cream border-2 border-border rounded-lg focus:border-accent-pink focus:outline-none transition-colors resize-none"
                  placeholder="Enter quote..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Attribution</label>
                <input
                  type="text"
                  value={(editedArgs.attribution as string) || ''}
                  onChange={(e) => handleFieldChange('attribution', e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-text-muted bg-bg-cream border-2 border-border rounded-lg focus:border-accent-pink focus:outline-none transition-colors"
                  placeholder="Quote author..."
                />
              </div>
            </>
          )}

          {(slideType === 'chart') && editedArgs.chart_type && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Chart Type</label>
              <p className="text-text-primary mt-1 px-3 py-2 bg-bg-cream rounded-lg capitalize">{editedArgs.chart_type as string}</p>
            </div>
          )}

          {(slideType === 'chart') && editedArgs.chart_data && Array.isArray(editedArgs.chart_data) && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Chart Data</label>
              <div className="mt-2 space-y-2">
                {(editedArgs.chart_data as Array<{label: string; value: number}>).map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const data = [...(editedArgs.chart_data as Array<{label: string; value: number}>)];
                        data[i] = { ...data[i], label: e.target.value };
                        handleFieldChange('chart_data', data);
                      }}
                      className="flex-1 px-3 py-2 text-text-secondary bg-bg-cream border-2 border-border rounded-lg focus:border-accent-pink focus:outline-none"
                    />
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => {
                        const data = [...(editedArgs.chart_data as Array<{label: string; value: number}>)];
                        data[i] = { ...data[i], value: parseFloat(e.target.value) || 0 };
                        handleFieldChange('chart_data', data);
                      }}
                      className="w-24 px-3 py-2 text-text-primary font-medium bg-bg-cream border-2 border-border rounded-lg focus:border-accent-pink focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {editedArgs.image_query && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Image Search</label>
              <input
                type="text"
                value={(editedArgs.image_query as string) || ''}
                onChange={(e) => handleFieldChange('image_query', e.target.value)}
                className="w-full mt-1 px-3 py-2 text-text-secondary italic bg-bg-cream border-2 border-border rounded-lg focus:border-accent-pink focus:outline-none transition-colors"
                placeholder="Image search keywords..."
              />
            </div>
          )}
        </div>

        {/* Footer with hint */}
        <div className="px-6 py-3 border-t-2 border-border bg-bg-cream">
          <p className="text-xs text-text-muted text-center">
            Changes are saved automatically and reflected in the preview
          </p>
        </div>
      </div>
    </div>
  );
}

function ToolCallItem({ event, isLatest, onClick }: { event: AgentEvent; isLatest: boolean; onClick?: () => void }) {
  if (event.tool === 'add_slide') {
    const slideType = event.args?.slide_type as string || 'content';
    const title = event.args?.title as string || '';
    return (
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-lg transition-all animate-fade-in cursor-pointer hover:shadow-sm',
          isLatest ? 'bg-accent-pink/10 border border-accent-pink/30' : 'bg-bg-cream hover:bg-bg-white'
        )}
        onClick={onClick}
      >
        <span className="text-base">{getSlideIcon(slideType)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-text-primary">
              Slide {event.slide_number}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-bg-white border border-border rounded text-text-muted capitalize">
              {slideType}
            </span>
          </div>
          <p className="text-xs text-text-secondary truncate">{title}</p>
        </div>
        <div className="flex-shrink-0">
          {isLatest ? (
            <Loader2 className="w-4 h-4 text-accent-pink animate-spin" />
          ) : (
            <Check className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>
    );
  }

  if (event.tool === 'finish_presentation') {
    return (
      <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-green-50 border border-green-200 animate-fade-in">
        <Sparkles className="w-4 h-4 text-green-600" />
        <span className="text-xs font-semibold text-green-700">
          Finalizing presentation...
        </span>
      </div>
    );
  }

  return null;
}

export function AgentProgress({ events, isComplete, theme = 'neobrutalism', totalSlides, onViewPresentation, onCreateNew, onUpdateSlide, onRegenerate }: AgentProgressProps) {
  const themeConfig = THEMES[theme] || THEMES.neobrutalism;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<AgentEvent | null>(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(theme);
  const activityRef = useRef<HTMLDivElement>(null);

  // Extract slides from events
  const slides = events
    .filter((e) => e.type === 'tool_call' && e.tool === 'add_slide' && e.slide)
    .map((e) => e.slide as Slide);

  // Get thinking messages
  const thinkingMessages = events.filter((e) => e.type === 'thinking' && e.message);

  // Get tool call events (for activity log)
  const toolEvents = events.filter((e) => e.type === 'tool_call');

  const completeEvent = events.find((e) => e.type === 'complete');

  // Auto-scroll activity log
  useEffect(() => {
    if (activityRef.current) {
      activityRef.current.scrollTop = activityRef.current.scrollHeight;
    }
  }, [events]);

  // Auto-advance to latest slide
  useEffect(() => {
    if (slides.length > 0) {
      setCurrentSlideIndex(slides.length - 1);
    }
  }, [slides.length]);

  const currentSlide = slides[currentSlideIndex];
  const latestThinking = thinkingMessages[thinkingMessages.length - 1];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="w-14 h-14 bg-accent-pink rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_#0f0f0f]">
          <Wand2 className="w-7 h-7 text-text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-text-primary">AI Agent</h3>
            {totalSlides && !isComplete && (
              <span className="px-3 py-1 bg-bg-white border-2 border-border rounded-full text-sm font-semibold text-text-secondary">
                {slides.length} / {totalSlides} slides
              </span>
            )}
          </div>
          <p className="text-base text-text-secondary">
            {isComplete ? 'Presentation ready!' : `Creating slide ${slides.length + 1}...`}
          </p>
        </div>
      </div>

      {/* Main content - side by side with larger preview */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Left: Agent Activity - Compact */}
        <div className="space-y-4 lg:sticky lg:top-8">
          {/* Thinking bubble - Compact */}
          {latestThinking && !isComplete && (
            <ThinkingBubble message={latestThinking.message!} />
          )}

          {/* Activity log - Smaller */}
          <div className="bg-bg-white border-2 border-border-dark rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_#0f0f0f]">
            <div className="px-4 py-3 border-b-2 border-border bg-bg-cream">
              <h4 className="text-sm font-bold text-text-primary">Activity Log</h4>
            </div>
            <div
              ref={activityRef}
              className="p-3 max-h-[280px] overflow-y-auto space-y-2"
            >
              {toolEvents.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-8 text-text-muted">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Starting generation...</span>
                </div>
              ) : (
                toolEvents.map((event, index) => (
                  <ToolCallItem
                    key={index}
                    event={event}
                    isLatest={index === toolEvents.length - 1 && !isComplete}
                    onClick={() => event.tool === 'add_slide' && setSelectedEvent(event)}
                  />
                ))
              )}

              {/* Completion message */}
              {completeEvent && (
                <div className="flex items-center gap-3 py-3 px-3 mt-2 rounded-lg bg-green-100 border-2 border-green-300">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#166534]">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      {completeEvent.title}
                    </p>
                    <p className="text-xs text-green-600">
                      {completeEvent.slide_count} slides created successfully
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Compact */}
          {completeEvent && (
            <div className="flex flex-col gap-2">
              {onViewPresentation && (
                <button
                  onClick={onViewPresentation}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-accent-pink text-text-primary font-bold text-sm rounded-lg border-2 border-border-dark shadow-[3px_3px_0px_0px_#0f0f0f] hover:shadow-[1px_1px_0px_0px_#0f0f0f] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <span>View Presentation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {onCreateNew && (
                <button
                  onClick={onCreateNew}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-bg-white text-text-primary font-medium text-sm rounded-lg border-2 border-border hover:border-border-dark hover:bg-bg-cream transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Presentation</span>
                </button>
              )}

              {/* Regenerate with Theme Selection */}
              {onRegenerate && (
                <div className="space-y-2">
                  {showThemeSelector ? (
                    <div className="p-3 bg-bg-white border-2 border-border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-text-primary flex items-center gap-1">
                          <Palette className="w-3 h-3" />
                          Select Theme
                        </label>
                        <button
                          onClick={() => setShowThemeSelector(false)}
                          className="p-1 hover:bg-bg-cream rounded"
                        >
                          <X className="w-3 h-3 text-text-muted" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {THEME_LIST.map((t) => (
                          <button
                            key={t.name}
                            onClick={() => setSelectedTheme(t.name as ThemeName)}
                            className={cn(
                              'px-2 py-1.5 text-xs text-left rounded border-2 transition-all',
                              selectedTheme === t.name
                                ? 'border-accent-pink bg-accent-pink/10 text-text-primary font-medium'
                                : 'border-border hover:border-border-dark bg-bg-cream text-text-secondary'
                            )}
                          >
                            {t.display_name}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          onRegenerate(selectedTheme);
                          setShowThemeSelector(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-bg-dark text-text-inverse font-medium text-xs rounded hover:bg-text-primary transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowThemeSelector(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-bg-cream text-text-primary font-medium text-sm rounded-lg border-2 border-border hover:border-border-dark transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Regenerate</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Live Preview - Larger */}
        <div className="space-y-4">
          {/* Current slide preview - Full size */}
          {currentSlide ? (
            <SlidePreview slide={currentSlide} theme={theme} isEditable={false} />
          ) : (
            <div
              className="w-full aspect-video flex items-center justify-center"
              style={{
                backgroundColor: themeConfig.colors.background,
                borderWidth: themeConfig.style.border_width,
                borderStyle: themeConfig.style.border_style,
                borderColor: themeConfig.colors.border_dark,
                borderRadius: themeConfig.style.border_radius,
                boxShadow: themeConfig.style.shadow
                  ? themeConfig.style.shadow.includes('rgba')
                    ? themeConfig.style.shadow
                    : `${themeConfig.style.shadow} ${themeConfig.colors.border_dark}`
                  : 'none',
              }}
            >
              <div className="text-center" style={{ color: themeConfig.colors.text_secondary }}>
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Generating first slide...</p>
              </div>
            </div>
          )}

          {/* Slide navigation - Compact */}
          {slides.length > 0 && (
            <div className="flex items-center gap-3 bg-bg-white border-2 border-border rounded-lg p-3">
              <button
                onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                disabled={currentSlideIndex === 0}
                className="p-1.5 rounded-lg hover:bg-bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex-1 flex items-center justify-center gap-1.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      index === currentSlideIndex ? 'scale-125' : 'hover:opacity-70'
                    )}
                    style={{
                      backgroundColor:
                        index === currentSlideIndex
                          ? themeConfig.colors.accent
                          : themeConfig.colors.border,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))
                }
                disabled={currentSlideIndex === slides.length - 1}
                className="p-1.5 rounded-lg hover:bg-bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-xs font-medium text-text-muted ml-1">
                {currentSlideIndex + 1} / {slides.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Slide Detail Modal */}
      {selectedEvent && (
        <SlideDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={onUpdateSlide}
        />
      )}
    </div>
  );
}
