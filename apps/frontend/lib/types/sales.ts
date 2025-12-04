/**
 * Sales pitch generation types
 * Mirrors backend schemas for type safety
 */

export interface ProductInfo {
  name: string;
  tagline?: string;
  description: string;
  key_features: string[];
  pricing?: string;
}

export interface TargetMarket {
  industry: string;
  audience: string;
  company_size?: string;
  geography?: string;
}

export interface PainPoints {
  problems: string[];
  current_solutions?: string;
  differentiators: string[];
}

export interface SocialProof {
  testimonials: string[];
  metrics: string[];
  logos: string[];
}

export interface CallToAction {
  goal: string;
  urgency?: string;
  next_steps: string[];
}

export interface SalesPitchInput {
  product: ProductInfo;
  market: TargetMarket;
  pain_points: PainPoints;
  social_proof?: SocialProof;
  cta: CallToAction;
  tone: SalesTone;
  slide_count: number;
  theme: string;
}

export type SalesTone =
  | 'professional'
  | 'persuasive'
  | 'casual'
  | 'technical'
  | 'inspirational';

export interface GenerateSalesPitchRequest {
  pitch: SalesPitchInput;
  title?: string;
}

export interface SalesPitchTextResponse {
  generated_text: string;
  suggested_title: string;
  slide_outline: string[];
}

// Wizard step types
export type WizardStep = 'product' | 'market' | 'problem' | 'proof' | 'cta' | 'review';

export interface WizardStepConfig {
  id: WizardStep;
  title: string;
  description: string;
  icon: string;
}

export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: 'product',
    title: 'Your Product',
    description: 'Tell us about what you\'re selling',
    icon: 'Package',
  },
  {
    id: 'market',
    title: 'Target Market',
    description: 'Who are you selling to?',
    icon: 'Target',
  },
  {
    id: 'problem',
    title: 'Problem & Solution',
    description: 'What pain points do you solve?',
    icon: 'Lightbulb',
  },
  {
    id: 'proof',
    title: 'Social Proof',
    description: 'Show credibility with results',
    icon: 'Award',
  },
  {
    id: 'cta',
    title: 'Call to Action',
    description: 'What do you want them to do?',
    icon: 'Rocket',
  },
  {
    id: 'review',
    title: 'Review & Generate',
    description: 'Review and create your pitch',
    icon: 'Sparkles',
  },
];

// Industry presets for quick selection
export const INDUSTRY_PRESETS = [
  'SaaS / Software',
  'E-commerce / Retail',
  'Healthcare / MedTech',
  'Finance / FinTech',
  'Real Estate',
  'Education / EdTech',
  'Marketing / Agency',
  'Manufacturing',
  'Consulting / Services',
  'Other',
] as const;

// Audience presets
export const AUDIENCE_PRESETS = [
  'C-Suite / Executives',
  'Investors / VCs',
  'Technical Team / Developers',
  'Marketing Team',
  'Sales Team',
  'Small Business Owners',
  'Enterprise Buyers',
  'End Users / Consumers',
  'Other',
] as const;

// Goal presets
export const GOAL_PRESETS = [
  'Close a sale',
  'Get funding / investment',
  'Product demo',
  'Partnership proposal',
  'Customer onboarding',
  'Upsell / Cross-sell',
  'Brand awareness',
  'Other',
] as const;

// Tone descriptions for UI
export const TONE_OPTIONS: { value: SalesTone; label: string; description: string }[] = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Confident and data-driven. Best for B2B enterprise.',
  },
  {
    value: 'persuasive',
    label: 'Persuasive',
    description: 'Benefit-focused with urgency. Best for closing deals.',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Friendly and relatable. Best for SMB and consumers.',
  },
  {
    value: 'technical',
    label: 'Technical',
    description: 'Detailed and spec-focused. Best for dev/IT audiences.',
  },
  {
    value: 'inspirational',
    label: 'Inspirational',
    description: 'Visionary and transformative. Best for investor pitches.',
  },
];
