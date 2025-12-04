'use client';

import { cn } from '@/lib/utils/cn';
import { ThemeSelector } from '@/components/molecules/ThemeSelector';
import { SlideCountSelector } from '@/components/atoms';
import { TONE_OPTIONS } from '@/lib/types';
import type {
  ProductInfo,
  TargetMarket,
  PainPoints,
  SocialProof,
  CallToAction,
  SalesTone,
} from '@/lib/types';
import type { ThemeName } from '@/lib/types/slide';

interface ReviewStepProps {
  product: ProductInfo;
  market: TargetMarket;
  painPoints: PainPoints;
  socialProof: SocialProof;
  cta: CallToAction;
  tone: SalesTone;
  onToneChange: (tone: SalesTone) => void;
  slideCount: number;
  onSlideCountChange: (count: number) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

export function ReviewStep({
  product,
  market,
  painPoints,
  socialProof,
  cta,
  tone,
  onToneChange,
  slideCount,
  onSlideCountChange,
  theme,
  onThemeChange,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Review your pitch
        </h2>
        <p className="text-text-secondary">
          Review your information and customize the output settings.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <SummaryCard title="Product" icon="📦">
          <p className="font-semibold">{product.name}</p>
          {product.tagline && <p className="text-sm text-text-secondary">{product.tagline}</p>}
          <p className="text-sm mt-2 line-clamp-2">{product.description}</p>
          {product.key_features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.key_features.slice(0, 3).map((f, i) => (
                <span key={i} className="text-xs bg-bg-secondary px-2 py-0.5 rounded">
                  {f}
                </span>
              ))}
              {product.key_features.length > 3 && (
                <span className="text-xs text-text-muted">
                  +{product.key_features.length - 3} more
                </span>
              )}
            </div>
          )}
        </SummaryCard>

        <SummaryCard title="Market" icon="🎯">
          <p>
            <span className="font-semibold">{market.industry}</span>
          </p>
          <p className="text-sm text-text-secondary">{market.audience}</p>
          {market.company_size && (
            <p className="text-sm text-text-muted">Size: {market.company_size}</p>
          )}
        </SummaryCard>

        <SummaryCard title="Pain Points" icon="💡">
          <ul className="text-sm space-y-1">
            {painPoints.problems.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span className="line-clamp-1">{p}</span>
              </li>
            ))}
          </ul>
          {painPoints.differentiators.length > 0 && (
            <p className="text-xs text-green-600 mt-2">
              {painPoints.differentiators.length} differentiator(s)
            </p>
          )}
        </SummaryCard>

        <SummaryCard title="Call to Action" icon="🚀">
          <p className="font-semibold">{cta.goal}</p>
          {cta.urgency && (
            <p className="text-sm text-orange-600">⚡ {cta.urgency}</p>
          )}
          {cta.next_steps.length > 0 && (
            <p className="text-xs text-text-muted mt-1">
              {cta.next_steps.length} next step(s) defined
            </p>
          )}
        </SummaryCard>
      </div>

      {/* Social Proof Summary */}
      {(socialProof.metrics.length > 0 ||
        socialProof.testimonials.length > 0 ||
        socialProof.logos.length > 0) && (
        <SummaryCard title="Social Proof" icon="⭐">
          <div className="flex flex-wrap gap-4 text-sm">
            {socialProof.metrics.length > 0 && (
              <span>{socialProof.metrics.length} metric(s)</span>
            )}
            {socialProof.testimonials.length > 0 && (
              <span>{socialProof.testimonials.length} testimonial(s)</span>
            )}
            {socialProof.logos.length > 0 && (
              <span>{socialProof.logos.length} customer(s)</span>
            )}
          </div>
        </SummaryCard>
      )}

      {/* Output Settings */}
      <div className="border-t border-border pt-6 space-y-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Presentation Settings
        </h3>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Pitch Tone
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {TONE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onToneChange(option.value)}
                className={cn(
                  'p-3 rounded-xl border-2 text-left transition-all',
                  tone === option.value
                    ? 'border-border-dark bg-accent-pink-light'
                    : 'border-border bg-bg-white hover:border-border-dark'
                )}
              >
                <p className="font-semibold text-sm">{option.label}</p>
                <p className="text-xs text-text-muted">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Visual Theme
          </label>
          <ThemeSelector
            value={theme as ThemeName}
            onChange={(t) => onThemeChange(t)}
          />
        </div>

        {/* Slide Count */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Number of Slides
          </label>
          <SlideCountSelector
            value={slideCount}
            onChange={onSlideCountChange}
            min={6}
            max={15}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-bg-secondary rounded-xl border-2 border-border">
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <h4 className="font-semibold text-text-primary">{title}</h4>
      </div>
      <div className="text-text-primary">{children}</div>
    </div>
  );
}
