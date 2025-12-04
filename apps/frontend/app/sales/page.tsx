'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SalesWizard } from '@/components/organisms/sales';
import { AgentProgress } from '@/components/organisms/agent';
import { useSlides } from '@/contexts/SlidesContext';
import { Megaphone } from 'lucide-react';
import type { SalesPitchInput } from '@/lib/types';

export default function SalesPage() {
  const router = useRouter();
  const { state, generateSalesPitch } = useSlides();

  const isComplete = state.agentEvents.some((e) => e.type === 'complete');
  const isGenerating = state.isGenerating || state.agentEvents.length > 0;

  // Navigate to presentation when generation completes
  useEffect(() => {
    if (isComplete && state.presentation) {
      const timer = setTimeout(() => {
        router.push('/presentation');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, state.presentation, router]);

  const handleSubmit = async (pitch: SalesPitchInput) => {
    await generateSalesPitch(pitch);
  };

  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent-pink rounded-full opacity-60 blur-xl" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-accent-pink rounded-full opacity-40 blur-2xl" />

      {isGenerating ? (
        /* Generation Progress */
        <div className="relative px-4 py-8 animate-fade-in">
          <AgentProgress
            events={state.agentEvents}
            isComplete={isComplete}
            theme={state.currentTheme}
          />
        </div>
      ) : (
        /* Sales Wizard */
        <div className="relative max-w-5xl mx-auto px-4 pt-8 pb-16">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-accent-pink rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#0f0f0f]">
              <Megaphone className="w-6 h-6 text-text-primary" />
            </div>
            <span className="text-2xl font-bold text-text-primary">Sales Pitch Generator</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Create a winning sales pitch
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Answer a few questions about your product and market.
              We&apos;ll generate a persuasive, industry-tailored presentation.
            </p>
          </div>

          {/* Error message */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-error rounded-xl text-center">
              <p className="text-error">{state.error}</p>
            </div>
          )}

          {/* Wizard */}
          <SalesWizard onSubmit={handleSubmit} isLoading={state.isGenerating} />
        </div>
      )}
    </main>
  );
}
