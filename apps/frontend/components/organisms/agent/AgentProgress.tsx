'use client';

import { useState, useEffect } from 'react';
import { Check, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { AgentEvent } from '@/lib/types';

interface AgentProgressProps {
  events: AgentEvent[];
  isComplete: boolean;
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
    default:
      return '📊';
  }
}

function EventItem({ event, isLatest }: { event: AgentEvent; isLatest: boolean }) {
  if (event.type === 'thinking') {
    return (
      <div className={cn(
        'flex items-center gap-3 py-2 px-3 rounded-lg transition-all',
        isLatest ? 'bg-accent-pink/10' : 'opacity-60'
      )}>
        <Loader2 className="w-4 h-4 text-accent-pink animate-spin" />
        <span className="text-sm text-text-secondary">{event.message}</span>
      </div>
    );
  }

  if (event.type === 'tool_call' && event.tool === 'add_slide') {
    const slideType = event.args?.slide_type as string || 'content';
    const title = event.args?.title as string || '';
    return (
      <div className={cn(
        'flex items-start gap-3 py-2 px-3 rounded-lg transition-all',
        isLatest ? 'bg-accent-pink/10' : ''
      )}>
        <div className="w-6 h-6 flex items-center justify-center text-lg">
          {getSlideIcon(slideType)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">
              Slide {event.slide_number}
            </span>
            <span className="text-xs px-2 py-0.5 bg-bg-cream rounded-full text-text-secondary capitalize">
              {slideType}
            </span>
          </div>
          <p className="text-sm text-text-secondary truncate mt-0.5">
            {title}
          </p>
        </div>
        {isLatest ? (
          <Loader2 className="w-4 h-4 text-accent-pink animate-spin flex-shrink-0" />
        ) : (
          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
        )}
      </div>
    );
  }

  if (event.type === 'tool_call' && event.tool === 'finish_presentation') {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-green-50">
        <Sparkles className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-700">
          Finalizing: {event.args?.title as string || 'Presentation'}
        </span>
      </div>
    );
  }

  if (event.type === 'complete') {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-green-100 border-2 border-green-200">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-green-800">{event.title}</p>
          <p className="text-sm text-green-600">{event.slide_count} slides created</p>
        </div>
      </div>
    );
  }

  if (event.type === 'error') {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-red-50 border border-red-200">
        <span className="text-sm text-red-600">{event.message}</span>
      </div>
    );
  }

  return null;
}

export function AgentProgress({ events, isComplete }: AgentProgressProps) {
  const [visibleEvents, setVisibleEvents] = useState<AgentEvent[]>([]);

  // Animate events appearing
  useEffect(() => {
    setVisibleEvents(events);
  }, [events]);

  const slideEvents = visibleEvents.filter(
    e => e.type === 'tool_call' && e.tool === 'add_slide'
  );
  const completeEvent = visibleEvents.find(e => e.type === 'complete');
  const latestEvent = visibleEvents[visibleEvents.length - 1];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent-pink rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#0f0f0f]">
          <Wand2 className="w-5 h-5 text-text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-text-primary">AI Agent</h3>
          <p className="text-sm text-text-secondary">
            {isComplete ? 'Presentation ready!' : 'Creating your slides...'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {!isComplete && slideEvents.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted">Progress</span>
            <span className="text-xs text-text-muted">{slideEvents.length} slides</span>
          </div>
          <div className="h-2 bg-bg-cream rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-pink rounded-full transition-all duration-500"
              style={{ width: `${Math.min((slideEvents.length / 5) * 100, 90)}%` }}
            />
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="space-y-2 bg-bg-white border-2 border-border rounded-2xl p-4 shadow-[4px_4px_0px_0px_#e5e5e5]">
        {visibleEvents.length === 0 ? (
          <div className="flex items-center gap-3 py-2">
            <Loader2 className="w-4 h-4 text-accent-pink animate-spin" />
            <span className="text-sm text-text-secondary">Starting...</span>
          </div>
        ) : (
          visibleEvents
            .filter(e => e.type !== 'tool_result') // Don't show tool results
            .map((event, index, arr) => (
              <EventItem
                key={index}
                event={event}
                isLatest={index === arr.length - 1 && !isComplete}
              />
            ))
        )}
      </div>
    </div>
  );
}
