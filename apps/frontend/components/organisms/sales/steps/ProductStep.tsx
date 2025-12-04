'use client';

import { useState } from 'react';
import { Input, TextArea, Button } from '@/components/atoms';
import { Plus, X } from 'lucide-react';
import type { ProductInfo } from '@/lib/types';

interface ProductStepProps {
  value: ProductInfo;
  onChange: (value: ProductInfo) => void;
}

export function ProductStep({ value, onChange }: ProductStepProps) {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim() && value.key_features.length < 8) {
      onChange({
        ...value,
        key_features: [...value.key_features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    onChange({
      ...value,
      key_features: value.key_features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Tell us about your product
        </h2>
        <p className="text-text-secondary">
          The more details you provide, the better your sales pitch will be.
        </p>
      </div>

      <Input
        label="Product / Service Name *"
        placeholder="e.g., Acme Analytics Platform"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />

      <Input
        label="Tagline (optional)"
        placeholder="e.g., Turn data into decisions in seconds"
        value={value.tagline || ''}
        onChange={(e) => onChange({ ...value, tagline: e.target.value })}
      />

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Description *
        </label>
        <TextArea
          placeholder="Describe what your product does and the value it provides. Be specific about capabilities and outcomes."
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          className="min-h-[120px]"
        />
        <p className="mt-1 text-sm text-text-muted">
          {value.description.length}/2000 characters (min 20)
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Key Features ({value.key_features.length}/8)
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a key feature..."
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addFeature();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={addFeature}
            disabled={!newFeature.trim() || value.key_features.length >= 8}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.key_features.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent-pink-light text-text-primary rounded-lg text-sm"
            >
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="hover:text-error"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <Input
        label="Pricing (optional)"
        placeholder="e.g., Starting at $49/month, Free trial available"
        value={value.pricing || ''}
        onChange={(e) => onChange({ ...value, pricing: e.target.value })}
      />
    </div>
  );
}
