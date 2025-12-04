'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/atoms';
import {
  Package,
  Target,
  Lightbulb,
  Award,
  Rocket,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import type {
  SalesPitchInput,
  ProductInfo,
  TargetMarket,
  PainPoints,
  SocialProof,
  CallToAction,
  WizardStep,
  SalesTone,
} from '@/lib/types';

import { ProductStep } from './steps/ProductStep';
import { MarketStep } from './steps/MarketStep';
import { ProblemStep } from './steps/ProblemStep';
import { ProofStep } from './steps/ProofStep';
import { CTAStep } from './steps/CTAStep';
import { ReviewStep } from './steps/ReviewStep';

const STEPS: { id: WizardStep; title: string; icon: React.ReactNode }[] = [
  { id: 'product', title: 'Product', icon: <Package className="w-5 h-5" /> },
  { id: 'market', title: 'Market', icon: <Target className="w-5 h-5" /> },
  { id: 'problem', title: 'Problem', icon: <Lightbulb className="w-5 h-5" /> },
  { id: 'proof', title: 'Proof', icon: <Award className="w-5 h-5" /> },
  { id: 'cta', title: 'CTA', icon: <Rocket className="w-5 h-5" /> },
  { id: 'review', title: 'Review', icon: <Sparkles className="w-5 h-5" /> },
];

interface SalesWizardProps {
  onSubmit: (pitch: SalesPitchInput) => Promise<void>;
  isLoading?: boolean;
}

const initialProduct: ProductInfo = {
  name: '',
  tagline: '',
  description: '',
  key_features: [],
  pricing: '',
};

const initialMarket: TargetMarket = {
  industry: '',
  audience: '',
  company_size: '',
  geography: '',
};

const initialPainPoints: PainPoints = {
  problems: [],
  current_solutions: '',
  differentiators: [],
};

const initialSocialProof: SocialProof = {
  testimonials: [],
  metrics: [],
  logos: [],
};

const initialCTA: CallToAction = {
  goal: '',
  urgency: '',
  next_steps: [],
};

export function SalesWizard({ onSubmit, isLoading }: SalesWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('product');
  const [product, setProduct] = useState<ProductInfo>(initialProduct);
  const [market, setMarket] = useState<TargetMarket>(initialMarket);
  const [painPoints, setPainPoints] = useState<PainPoints>(initialPainPoints);
  const [socialProof, setSocialProof] = useState<SocialProof>(initialSocialProof);
  const [cta, setCTA] = useState<CallToAction>(initialCTA);
  const [tone, setTone] = useState<SalesTone>('professional');
  const [slideCount, setSlideCount] = useState(10);
  const [theme, setTheme] = useState('corporate');

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'product':
        return product.name.length >= 2 && product.description.length >= 20;
      case 'market':
        return market.industry.length > 0 && market.audience.length > 0;
      case 'problem':
        return painPoints.problems.length >= 1;
      case 'proof':
        return true; // Optional step
      case 'cta':
        return cta.goal.length > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  }, [currentStep, product, market, painPoints, cta]);

  const goNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const goToStep = (step: WizardStep) => {
    const targetIndex = STEPS.findIndex((s) => s.id === step);
    // Only allow going to completed steps or current step
    if (targetIndex <= currentStepIndex) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async () => {
    const pitch: SalesPitchInput = {
      product,
      market,
      pain_points: painPoints,
      social_proof: socialProof.metrics.length > 0 || socialProof.testimonials.length > 0 ? socialProof : undefined,
      cta,
      tone,
      slide_count: slideCount,
      theme,
    };
    await onSubmit(pitch);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  disabled={index > currentStepIndex}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all',
                    isCurrent && 'bg-accent-pink text-text-primary font-semibold',
                    isCompleted && 'text-text-primary cursor-pointer hover:bg-bg-secondary',
                    !isCurrent && !isCompleted && 'text-text-muted cursor-not-allowed'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center border-2',
                      isCurrent && 'bg-bg-dark text-text-inverse border-border-dark',
                      isCompleted && 'bg-success text-text-inverse border-success',
                      !isCurrent && !isCompleted && 'bg-bg-secondary border-border'
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
                  </div>
                  <span className="hidden md:inline">{step.title}</span>
                </button>

                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'w-8 h-0.5 mx-2',
                      index < currentStepIndex ? 'bg-success' : 'bg-border'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-bg-white border-2 border-border-dark rounded-2xl p-6 md:p-8 shadow-[4px_4px_0px_0px_#0f0f0f]">
        {currentStep === 'product' && (
          <ProductStep value={product} onChange={setProduct} />
        )}
        {currentStep === 'market' && (
          <MarketStep value={market} onChange={setMarket} />
        )}
        {currentStep === 'problem' && (
          <ProblemStep value={painPoints} onChange={setPainPoints} />
        )}
        {currentStep === 'proof' && (
          <ProofStep value={socialProof} onChange={setSocialProof} />
        )}
        {currentStep === 'cta' && (
          <CTAStep value={cta} onChange={setCTA} />
        )}
        {currentStep === 'review' && (
          <ReviewStep
            product={product}
            market={market}
            painPoints={painPoints}
            socialProof={socialProof}
            cta={cta}
            tone={tone}
            onToneChange={setTone}
            slideCount={slideCount}
            onSlideCountChange={setSlideCount}
            theme={theme}
            onThemeChange={setTheme}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="secondary"
            onClick={goBack}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>

          {currentStep === 'review' ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isLoading}
              isLoading={isLoading}
            >
              <Sparkles className="w-5 h-5" />
              Generate Sales Pitch
            </Button>
          ) : (
            <Button onClick={goNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
