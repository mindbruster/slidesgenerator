'use client';

import { useState } from 'react';
import { Input, TextArea, Button } from '@/components/atoms';
import { Plus, X } from 'lucide-react';
import type { PainPoints } from '@/lib/types';

interface ProblemStepProps {
  value: PainPoints;
  onChange: (value: PainPoints) => void;
}

export function ProblemStep({ value, onChange }: ProblemStepProps) {
  const [newProblem, setNewProblem] = useState('');
  const [newDifferentiator, setNewDifferentiator] = useState('');

  const addProblem = () => {
    if (newProblem.trim() && value.problems.length < 6) {
      onChange({
        ...value,
        problems: [...value.problems, newProblem.trim()],
      });
      setNewProblem('');
    }
  };

  const removeProblem = (index: number) => {
    onChange({
      ...value,
      problems: value.problems.filter((_, i) => i !== index),
    });
  };

  const addDifferentiator = () => {
    if (newDifferentiator.trim() && value.differentiators.length < 5) {
      onChange({
        ...value,
        differentiators: [...value.differentiators, newDifferentiator.trim()],
      });
      setNewDifferentiator('');
    }
  };

  const removeDifferentiator = (index: number) => {
    onChange({
      ...value,
      differentiators: value.differentiators.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          What problems do you solve?
        </h2>
        <p className="text-text-secondary">
          Great sales pitches connect with pain points. What frustrates your customers?
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Customer Pain Points * ({value.problems.length}/6)
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="e.g., Spending hours on manual data entry"
            value={newProblem}
            onChange={(e) => setNewProblem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addProblem();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={addProblem}
            disabled={!newProblem.trim() || value.problems.length >= 6}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-2">
          {value.problems.map((problem, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl"
            >
              <span className="flex-1 text-text-primary">{problem}</span>
              <button
                type="button"
                onClick={() => removeProblem(index)}
                className="text-text-muted hover:text-error"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          {value.problems.length === 0 && (
            <p className="text-sm text-text-muted italic">
              Add at least one pain point your product solves
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Current Solutions (optional)
        </label>
        <TextArea
          placeholder="How do customers currently solve this problem? What alternatives exist? (competitors, manual processes, etc.)"
          value={value.current_solutions || ''}
          onChange={(e) => onChange({ ...value, current_solutions: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          What Makes You Different ({value.differentiators.length}/5)
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="e.g., 10x faster than alternatives"
            value={newDifferentiator}
            onChange={(e) => setNewDifferentiator(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addDifferentiator();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={addDifferentiator}
            disabled={!newDifferentiator.trim() || value.differentiators.length >= 5}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.differentiators.map((diff, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm border-2 border-green-200"
            >
              {diff}
              <button
                type="button"
                onClick={() => removeDifferentiator(index)}
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
