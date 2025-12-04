'use client';

import { useState } from 'react';
import { Input, TextArea, Button } from '@/components/atoms';
import { Plus, X, Quote, TrendingUp, Building2 } from 'lucide-react';
import type { SocialProof } from '@/lib/types';

interface ProofStepProps {
  value: SocialProof;
  onChange: (value: SocialProof) => void;
}

export function ProofStep({ value, onChange }: ProofStepProps) {
  const [newTestimonial, setNewTestimonial] = useState('');
  const [newMetric, setNewMetric] = useState('');
  const [newLogo, setNewLogo] = useState('');

  const addTestimonial = () => {
    if (newTestimonial.trim() && value.testimonials.length < 4) {
      onChange({
        ...value,
        testimonials: [...value.testimonials, newTestimonial.trim()],
      });
      setNewTestimonial('');
    }
  };

  const removeTestimonial = (index: number) => {
    onChange({
      ...value,
      testimonials: value.testimonials.filter((_, i) => i !== index),
    });
  };

  const addMetric = () => {
    if (newMetric.trim() && value.metrics.length < 6) {
      onChange({
        ...value,
        metrics: [...value.metrics, newMetric.trim()],
      });
      setNewMetric('');
    }
  };

  const removeMetric = (index: number) => {
    onChange({
      ...value,
      metrics: value.metrics.filter((_, i) => i !== index),
    });
  };

  const addLogo = () => {
    if (newLogo.trim() && value.logos.length < 8) {
      onChange({
        ...value,
        logos: [...value.logos, newLogo.trim()],
      });
      setNewLogo('');
    }
  };

  const removeLogo = (index: number) => {
    onChange({
      ...value,
      logos: value.logos.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Build credibility with proof
        </h2>
        <p className="text-text-secondary">
          This step is optional but highly recommended. Social proof increases trust.
        </p>
      </div>

      {/* Success Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-accent-pink" />
          <label className="text-sm font-semibold text-text-primary">
            Success Metrics ({value.metrics.length}/6)
          </label>
        </div>
        <p className="text-sm text-text-muted mb-3">
          Quantifiable results your customers have achieved
        </p>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="e.g., 50% cost reduction, 10x faster deployment"
            value={newMetric}
            onChange={(e) => setNewMetric(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addMetric();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={addMetric}
            disabled={!newMetric.trim() || value.metrics.length >= 6}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.metrics.map((metric, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm border-2 border-blue-200"
            >
              {metric}
              <button
                type="button"
                onClick={() => removeMetric(index)}
                className="hover:text-error"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Quote className="w-5 h-5 text-accent-pink" />
          <label className="text-sm font-semibold text-text-primary">
            Testimonials ({value.testimonials.length}/4)
          </label>
        </div>
        <p className="text-sm text-text-muted mb-3">
          Real quotes from happy customers
        </p>
        <div className="flex gap-2 mb-3">
          <TextArea
            placeholder="e.g., 'This product transformed our workflow. We can't imagine going back.' - John, CTO at TechCorp"
            value={newTestimonial}
            onChange={(e) => setNewTestimonial(e.target.value)}
            className="min-h-[80px]"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={addTestimonial}
            disabled={!newTestimonial.trim() || value.testimonials.length >= 4}
            className="flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {value.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-purple-50 border-2 border-purple-200 rounded-xl"
            >
              <Quote className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
              <span className="flex-1 text-text-primary text-sm italic">{testimonial}</span>
              <button
                type="button"
                onClick={() => removeTestimonial(index)}
                className="text-text-muted hover:text-error flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Logos */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-accent-pink" />
          <label className="text-sm font-semibold text-text-primary">
            Notable Customers ({value.logos.length}/8)
          </label>
        </div>
        <p className="text-sm text-text-muted mb-3">
          Names of companies or customers you work with
        </p>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="e.g., Google, Microsoft, Startup Inc."
            value={newLogo}
            onChange={(e) => setNewLogo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addLogo();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={addLogo}
            disabled={!newLogo.trim() || value.logos.length >= 8}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.logos.map((logo, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-bg-secondary text-text-primary rounded-lg text-sm border-2 border-border"
            >
              {logo}
              <button
                type="button"
                onClick={() => removeLogo(index)}
                className="hover:text-error"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
