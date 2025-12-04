'use client';

import { Input } from '@/components/atoms';
import { cn } from '@/lib/utils/cn';
import { INDUSTRY_PRESETS, AUDIENCE_PRESETS } from '@/lib/types';
import type { TargetMarket } from '@/lib/types';

interface MarketStepProps {
  value: TargetMarket;
  onChange: (value: TargetMarket) => void;
}

export function MarketStep({ value, onChange }: MarketStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Who are you selling to?
        </h2>
        <p className="text-text-secondary">
          Understanding your audience helps us craft the perfect pitch.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Industry *
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {INDUSTRY_PRESETS.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => onChange({ ...value, industry })}
              className={cn(
                'px-4 py-2 rounded-xl border-2 transition-all text-sm',
                value.industry === industry
                  ? 'border-border-dark bg-accent-pink text-text-primary font-semibold'
                  : 'border-border bg-bg-white text-text-secondary hover:border-border-dark'
              )}
            >
              {industry}
            </button>
          ))}
        </div>
        <Input
          placeholder="Or type a custom industry..."
          value={INDUSTRY_PRESETS.includes(value.industry as any) ? '' : value.industry}
          onChange={(e) => onChange({ ...value, industry: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Target Audience *
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {AUDIENCE_PRESETS.map((audience) => (
            <button
              key={audience}
              type="button"
              onClick={() => onChange({ ...value, audience })}
              className={cn(
                'px-4 py-2 rounded-xl border-2 transition-all text-sm',
                value.audience === audience
                  ? 'border-border-dark bg-accent-pink text-text-primary font-semibold'
                  : 'border-border bg-bg-white text-text-secondary hover:border-border-dark'
              )}
            >
              {audience}
            </button>
          ))}
        </div>
        <Input
          placeholder="Or type a custom audience..."
          value={AUDIENCE_PRESETS.includes(value.audience as any) ? '' : value.audience}
          onChange={(e) => onChange({ ...value, audience: e.target.value })}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Company Size (optional)"
          placeholder="e.g., SMB, Enterprise, 50-500 employees"
          value={value.company_size || ''}
          onChange={(e) => onChange({ ...value, company_size: e.target.value })}
        />

        <Input
          label="Geography (optional)"
          placeholder="e.g., US, Global, Europe"
          value={value.geography || ''}
          onChange={(e) => onChange({ ...value, geography: e.target.value })}
        />
      </div>
    </div>
  );
}
