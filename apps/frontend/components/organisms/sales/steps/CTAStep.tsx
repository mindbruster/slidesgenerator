'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/atoms';
import { cn } from '@/lib/utils/cn';
import { Plus, X } from 'lucide-react';
import { GOAL_PRESETS } from '@/lib/types';
import type { CallToAction } from '@/lib/types';

interface CTAStepProps {
  value: CallToAction;
  onChange: (value: CallToAction) => void;
}

export function CTAStep({ value, onChange }: CTAStepProps) {
  const [newStep, setNewStep] = useState('');

  const addNextStep = () => {
    if (newStep.trim() && value.next_steps.length < 4) {
      onChange({
        ...value,
        next_steps: [...value.next_steps, newStep.trim()],
      });
      setNewStep('');
    }
  };

  const removeNextStep = (index: number) => {
    onChange({
      ...value,
      next_steps: value.next_steps.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          What&apos;s your call to action?
        </h2>
        <p className="text-text-secondary">
          Every great sales pitch ends with a clear ask. What do you want them to do?
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-3">
          Primary Goal *
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {GOAL_PRESETS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => onChange({ ...value, goal })}
              className={cn(
                'px-4 py-2 rounded-xl border-2 transition-all text-sm',
                value.goal === goal
                  ? 'border-border-dark bg-accent-pink text-text-primary font-semibold'
                  : 'border-border bg-bg-white text-text-secondary hover:border-border-dark'
              )}
            >
              {goal}
            </button>
          ))}
        </div>
        <Input
          placeholder="Or type a custom goal..."
          value={GOAL_PRESETS.includes(value.goal as any) ? '' : value.goal}
          onChange={(e) => onChange({ ...value, goal: e.target.value })}
        />
      </div>

      <Input
        label="Urgency Driver (optional)"
        placeholder="e.g., Limited spots available, Offer ends Friday, Exclusive beta access"
        value={value.urgency || ''}
        onChange={(e) => onChange({ ...value, urgency: e.target.value })}
      />

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Next Steps ({value.next_steps.length}/4)
        </label>
        <p className="text-sm text-text-muted mb-3">
          Clear actions for your audience to take
        </p>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="e.g., Visit our website, Schedule a demo call"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addNextStep();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={addNextStep}
            disabled={!newStep.trim() || value.next_steps.length >= 4}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {value.next_steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-accent-pink-light border-2 border-accent-pink rounded-xl"
            >
              <span className="w-6 h-6 bg-accent-pink text-text-primary rounded-lg flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <span className="flex-1 text-text-primary">{step}</span>
              <button
                type="button"
                onClick={() => removeNextStep(index)}
                className="text-text-muted hover:text-error"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
