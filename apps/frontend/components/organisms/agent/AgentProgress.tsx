'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Loader2, Sparkles, Wand2, Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { AgentEvent, Slide, ThemeName } from '@/lib/types';
import { THEMES } from '@/lib/themes';
import { SlidePreview } from '@/components/organisms/slides/SlidePreview';

interface AgentProgressProps {
  events: AgentEvent[];
  isComplete: boolean;
  theme?: ThemeName;
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

function ToolCallItem({ event, isLatest }: { event: AgentEvent; isLatest: boolean }) {
  if (event.tool === 'add_slide') {
    const slideType = event.args?.slide_type as string || 'content';
    const title = event.args?.title as string || '';
    return (
      <div
        className={cn(
          'flex items-start gap-3 py-3 px-4 rounded-xl transition-all animate-fade-in',
          isLatest ? 'bg-accent-pink/10 border-2 border-accent-pink/30' : 'bg-bg-cream'
        )}
      >
        <span className="text-2xl">{getSlideIcon(slideType)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-semibold text-text-primary">
              Slide {event.slide_number}
            </span>
            <span className="text-xs px-2 py-1 bg-bg-white border border-border rounded-full text-text-muted capitalize">
              {slideType}
            </span>
          </div>
          <p className="text-sm text-text-secondary truncate">{title}</p>
        </div>
        {isLatest ? (
          <Loader2 className="w-5 h-5 text-accent-pink animate-spin flex-shrink-0 mt-1" />
        ) : (
          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
        )}
      </div>
    );
  }

  if (event.tool === 'finish_presentation') {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-green-50 border-2 border-green-200 animate-fade-in">
        <Sparkles className="w-5 h-5 text-green-600" />
        <span className="text-base font-semibold text-green-700">
          Finalizing presentation...
        </span>
      </div>
    );
  }

  return null;
}

export function AgentProgress({ events, isComplete, theme = 'neobrutalism' }: AgentProgressProps) {
  const themeConfig = THEMES[theme] || THEMES.neobrutalism;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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
          <h3 className="text-xl font-bold text-text-primary">AI Agent</h3>
          <p className="text-base text-text-secondary">
            {isComplete ? 'Presentation ready!' : `Creating slide ${slides.length + 1}...`}
          </p>
        </div>
      </div>

      {/* Main content - side by side */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Agent Activity */}
        <div className="space-y-6 lg:sticky lg:top-8">
          {/* Thinking bubble */}
          {latestThinking && !isComplete && (
            <ThinkingBubble message={latestThinking.message!} />
          )}

          {/* Activity log */}
          <div className="bg-bg-white border-2 border-border-dark rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#0f0f0f]">
            <div className="px-6 py-4 border-b-2 border-border bg-bg-cream">
              <h4 className="text-lg font-bold text-text-primary">Activity Log</h4>
            </div>
            <div
              ref={activityRef}
              className="p-4 max-h-[500px] overflow-y-auto space-y-3"
            >
              {toolEvents.length === 0 ? (
                <div className="flex items-center justify-center gap-3 py-12 text-text-muted">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Starting generation...</span>
                </div>
              ) : (
                toolEvents.map((event, index) => (
                  <ToolCallItem
                    key={index}
                    event={event}
                    isLatest={index === toolEvents.length - 1 && !isComplete}
                  />
                ))
              )}

              {/* Completion message */}
              {completeEvent && (
                <div className="flex items-center gap-4 py-4 px-4 mt-4 rounded-xl bg-green-100 border-2 border-green-300">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#166534]">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-800">
                      {completeEvent.title}
                    </p>
                    <p className="text-sm text-green-600">
                      {completeEvent.slide_count} slides created successfully
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="space-y-6">
          {/* Current slide preview */}
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

          {/* Slide navigation */}
          {slides.length > 0 && (
            <div className="flex items-center gap-4 bg-bg-white border-2 border-border rounded-xl p-4">
              <button
                onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                disabled={currentSlideIndex === 0}
                className="p-2 rounded-lg hover:bg-bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 flex items-center justify-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={cn(
                      'w-3 h-3 rounded-full transition-all',
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
                className="p-2 rounded-lg hover:bg-bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <span className="text-sm font-medium text-text-muted ml-2">
                {currentSlideIndex + 1} / {slides.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
