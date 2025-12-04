/**
 * Template definitions for the Template Gallery
 * Each template has unique dummy content for preview
 */

import type { ThemeName } from './types/slide';

export type TemplateCategory =
  | 'business'
  | 'education'
  | 'creative'
  | 'technology'
  | 'personal';

export interface TemplateSlide {
  type: 'title' | 'content' | 'bullets' | 'quote' | 'section' | 'two-column' | 'image-left' | 'image-right';
  title?: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  quote?: string;
  attribution?: string;
  leftContent?: string[];
  rightContent?: string[];
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  theme: ThemeName;
  samplePrompt: string;
  slides: TemplateSlide[];
  accentColor?: string;
}

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, { label: string }> = {
  business: { label: 'Business' },
  education: { label: 'Education' },
  creative: { label: 'Creative' },
  technology: { label: 'Technology' },
  personal: { label: 'Personal' },
};

export const TEMPLATES: Template[] = [
  // ==================== BUSINESS ====================
  {
    id: 'startup-pitch',
    title: 'Startup Pitch',
    description: 'Investor pitch deck with problem-solution flow',
    category: 'business',
    theme: 'corporate',
    samplePrompt: 'Create a pitch deck for a startup that helps small businesses automate their social media marketing using AI.',
    slides: [
      { type: 'title', title: 'TechFlow AI', subtitle: 'Revolutionizing Social Media Marketing' },
      { type: 'section', title: 'The Problem' },
      { type: 'bullets', title: 'Market Pain Points', bullets: ['80% of SMBs struggle with social media', 'Average 15 hours/week spent on content', 'Inconsistent posting hurts engagement'] },
      { type: 'content', title: 'Our Solution', body: 'AI-powered platform that creates, schedules, and optimizes social media content automatically.' },
      { type: 'quote', quote: 'TechFlow saved us 12 hours every week while doubling our engagement.', attribution: 'Sarah Chen, CEO of GrowthCo' },
    ],
  },
  {
    id: 'quarterly-report',
    title: 'Quarterly Report',
    description: 'Business metrics and performance review',
    category: 'business',
    theme: 'minimal',
    samplePrompt: 'Create a quarterly business review covering sales performance, key achievements, challenges, and goals.',
    slides: [
      { type: 'title', title: 'Q4 2024 Report', subtitle: 'Performance Review & Outlook' },
      { type: 'two-column', title: 'Key Metrics', leftContent: ['Revenue: $2.4M', 'Growth: +34%', 'New Customers: 156'], rightContent: ['Churn Rate: 2.1%', 'NPS Score: 72', 'Team Size: 45'] },
      { type: 'bullets', title: 'Achievements', bullets: ['Launched mobile app with 50K downloads', 'Expanded to 3 new markets', 'Reduced CAC by 28%'] },
      { type: 'content', title: 'Q1 Focus', body: 'Enterprise tier launch, Series B preparation, and international expansion to APAC region.' },
    ],
  },
  {
    id: 'sales-proposal',
    title: 'Sales Proposal',
    description: 'Professional client proposal template',
    category: 'business',
    theme: 'corporate',
    samplePrompt: 'Create a sales proposal for enterprise software implementation services.',
    slides: [
      { type: 'title', title: 'Enterprise Solution', subtitle: 'Proposal for Acme Corporation' },
      { type: 'bullets', title: 'Understanding Your Needs', bullets: ['Legacy system modernization', 'Real-time analytics dashboard', 'Seamless team collaboration'] },
      { type: 'two-column', title: 'Our Approach', leftContent: ['Discovery Phase', 'Custom Development', 'Quality Assurance'], rightContent: ['User Training', 'Go-Live Support', 'Ongoing Maintenance'] },
      { type: 'content', title: 'Investment', body: 'Complete implementation package starting at $125,000 with 12-month support included.' },
    ],
  },

  // ==================== EDUCATION ====================
  {
    id: 'lecture-slides',
    title: 'Academic Lecture',
    description: 'Clean educational presentation',
    category: 'education',
    theme: 'minimal',
    samplePrompt: 'Create a lecture about machine learning basics covering supervised and unsupervised learning.',
    slides: [
      { type: 'title', title: 'Introduction to Machine Learning', subtitle: 'CS 301 - Fall 2024' },
      { type: 'content', title: 'What is Machine Learning?', body: 'Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.' },
      { type: 'two-column', title: 'Types of Learning', leftContent: ['Supervised Learning', 'Labeled training data', 'Classification & Regression'], rightContent: ['Unsupervised Learning', 'No labeled data', 'Clustering & Association'] },
      { type: 'bullets', title: 'Key Takeaways', bullets: ['ML learns patterns from data', 'Choose algorithm based on problem type', 'Data quality is crucial for success'] },
    ],
  },
  {
    id: 'research-defense',
    title: 'Research Defense',
    description: 'Academic research presentation',
    category: 'education',
    theme: 'magazine',
    samplePrompt: 'Create a thesis defense presentation about the impact of remote work on productivity.',
    slides: [
      { type: 'title', title: 'Remote Work & Productivity', subtitle: 'A Mixed-Methods Study' },
      { type: 'bullets', title: 'Research Questions', bullets: ['How does remote work affect individual productivity?', 'What factors moderate this relationship?', 'How do teams adapt collaboration practices?'] },
      { type: 'content', title: 'Methodology', body: 'Survey of 500 knowledge workers combined with 30 in-depth interviews across 5 industries over 18 months.' },
      { type: 'two-column', title: 'Key Findings', leftContent: ['23% productivity increase', 'Better work-life balance', 'Reduced commute stress'], rightContent: ['Communication challenges', 'Onboarding difficulties', 'Team cohesion concerns'] },
      { type: 'quote', quote: 'Remote work is not just a perk anymore, it is a fundamental shift in how we organize work.', attribution: 'Study Participant, Tech Manager' },
    ],
  },
  {
    id: 'workshop-training',
    title: 'Workshop',
    description: 'Interactive training session',
    category: 'education',
    theme: 'playful',
    samplePrompt: 'Create a design thinking workshop covering the 5 stages of the process.',
    slides: [
      { type: 'title', title: 'Design Thinking 101', subtitle: 'A Hands-On Workshop' },
      { type: 'section', title: 'What Will You Learn?' },
      { type: 'bullets', title: 'The 5 Stages', bullets: ['Empathize - Understand your users', 'Define - Frame the problem', 'Ideate - Generate solutions', 'Prototype - Build to learn', 'Test - Validate with users'] },
      { type: 'content', title: 'Activity Time!', body: 'Break into groups of 4. You have 15 minutes to interview your partner and map their morning routine pain points.' },
    ],
  },

  // ==================== CREATIVE ====================
  {
    id: 'portfolio-showcase',
    title: 'Portfolio',
    description: 'Creative work showcase',
    category: 'creative',
    theme: 'neobrutalism',
    samplePrompt: 'Create a portfolio presentation showcasing design projects and skills.',
    slides: [
      { type: 'title', title: 'Alex Rivera', subtitle: 'Product Designer & Creative Director' },
      { type: 'content', title: 'About Me', body: '8+ years crafting digital experiences for startups and Fortune 500 companies. Passionate about accessible, human-centered design.' },
      { type: 'section', title: 'Featured Work' },
      { type: 'bullets', title: 'Project: HealthApp Redesign', bullets: ['Increased user engagement by 45%', 'Reduced onboarding drop-off by 60%', '4.8 star App Store rating'] },
      { type: 'content', title: "Let's Connect", body: 'alex@design.co | @alexrivera | alexrivera.design' },
    ],
  },
  {
    id: 'brand-identity',
    title: 'Brand Guidelines',
    description: 'Visual identity documentation',
    category: 'creative',
    theme: 'magazine',
    samplePrompt: 'Create brand guidelines for a sustainable fashion brand.',
    slides: [
      { type: 'title', title: 'Verde Fashion', subtitle: 'Brand Guidelines 2024' },
      { type: 'bullets', title: 'Brand Values', bullets: ['Sustainability First', 'Timeless Over Trendy', 'Transparent & Ethical', 'Community Driven'] },
      { type: 'two-column', title: 'Color Palette', leftContent: ['Forest Green #2D5A3D', 'Sand Beige #E8DCC4', 'Earth Brown #6B4423'], rightContent: ['Cloud White #F9F7F4', 'Charcoal #333333', 'Accent Gold #C9A227'] },
      { type: 'content', title: 'Typography', body: 'Primary: Playfair Display for headlines. Secondary: Source Sans Pro for body text. Always maintain generous whitespace.' },
      { type: 'quote', quote: 'Style that respects both people and planet.', attribution: 'Brand Tagline' },
    ],
  },
  {
    id: 'event-deck',
    title: 'Event Deck',
    description: 'Conference or event presentation',
    category: 'creative',
    theme: 'dark',
    samplePrompt: 'Create an event presentation for a tech conference.',
    slides: [
      { type: 'title', title: 'DesignCon 2024', subtitle: 'The Future of Digital Experience' },
      { type: 'bullets', title: 'What to Expect', bullets: ['50+ World-class Speakers', '3 Days of Workshops', 'Networking with 2000+ Designers', 'Exclusive Product Launches'] },
      { type: 'two-column', title: 'Keynote Speakers', leftContent: ['Jane Smith - Google', 'Mark Chen - Figma', 'Lisa Park - Apple'], rightContent: ['David Kim - Airbnb', 'Emma Wilson - Stripe', 'James Lee - Meta'] },
      { type: 'content', title: 'Join Us', body: 'March 15-17, 2024 | San Francisco | Early bird tickets available now at designcon.io' },
    ],
  },

  // ==================== TECHNOLOGY ====================
  {
    id: 'product-launch',
    title: 'Product Launch',
    description: 'New product announcement',
    category: 'technology',
    theme: 'dark',
    samplePrompt: 'Create a product launch presentation for an AI-powered code editor.',
    slides: [
      { type: 'title', title: 'Introducing CodeMind', subtitle: 'The AI-Powered IDE' },
      { type: 'section', title: 'Code Smarter, Ship Faster' },
      { type: 'bullets', title: 'Key Features', bullets: ['Intelligent Code Completion', 'Real-time Bug Detection', 'Automated Refactoring', 'Natural Language Commands'] },
      { type: 'two-column', title: 'Performance', leftContent: ['50% faster coding', '80% fewer bugs', '3x faster reviews'], rightContent: ['Supports 40+ languages', 'Cloud & local modes', 'Team collaboration'] },
      { type: 'content', title: 'Get Started', body: 'Free for individual developers. Team plans starting at $15/month. Download at codemind.dev' },
    ],
  },
  {
    id: 'tech-architecture',
    title: 'System Architecture',
    description: 'Technical system overview',
    category: 'technology',
    theme: 'terminal',
    samplePrompt: 'Create a technical architecture overview for a microservices system.',
    slides: [
      { type: 'title', title: 'Platform Architecture', subtitle: 'Microservices Overview v2.0' },
      { type: 'bullets', title: 'Core Services', bullets: ['API Gateway - Kong', 'Auth Service - OAuth2 + JWT', 'User Service - PostgreSQL', 'Notification Service - Redis + WebSocket'] },
      { type: 'two-column', title: 'Infrastructure', leftContent: ['AWS EKS Clusters', 'RDS PostgreSQL', 'ElastiCache Redis'], rightContent: ['CloudFront CDN', 'S3 Object Storage', 'CloudWatch Monitoring'] },
      { type: 'content', title: 'Deployment', body: 'GitOps workflow with ArgoCD. Blue-green deployments. 99.99% uptime SLA.' },
    ],
  },
  {
    id: 'api-overview',
    title: 'API Documentation',
    description: 'Developer API presentation',
    category: 'technology',
    theme: 'terminal',
    samplePrompt: 'Create an API documentation overview for a REST API.',
    slides: [
      { type: 'title', title: 'REST API v2', subtitle: 'Developer Documentation' },
      { type: 'content', title: 'Authentication', body: 'Bearer token authentication. Include header: Authorization: Bearer <your_api_key>' },
      { type: 'bullets', title: 'Core Endpoints', bullets: ['GET /users - List all users', 'POST /users - Create user', 'GET /users/:id - Get user details', 'PUT /users/:id - Update user'] },
      { type: 'two-column', title: 'Response Codes', leftContent: ['200 - Success', '201 - Created', '204 - No Content'], rightContent: ['400 - Bad Request', '401 - Unauthorized', '404 - Not Found'] },
    ],
  },

  // ==================== PERSONAL ====================
  {
    id: 'personal-intro',
    title: 'About Me',
    description: 'Personal introduction deck',
    category: 'personal',
    theme: 'neobrutalism',
    samplePrompt: 'Create a personal introduction presentation for a job interview.',
    slides: [
      { type: 'title', title: 'Hi, I\'m Jordan!', subtitle: 'Full-Stack Developer' },
      { type: 'content', title: 'My Journey', body: '5 years building web applications. Started with WordPress, now architecting scalable SaaS platforms. Love turning complex problems into simple solutions.' },
      { type: 'bullets', title: 'What I Bring', bullets: ['React, Node.js, Python expertise', 'Led teams of 5-10 engineers', 'Shipped 20+ production apps', 'Open source contributor'] },
      { type: 'content', title: 'Let\'s Talk!', body: 'jordan@email.com | github.com/jordan | linkedin.com/in/jordan' },
    ],
  },
  {
    id: 'travel-guide',
    title: 'Travel Guide',
    description: 'Trip itinerary presentation',
    category: 'personal',
    theme: 'playful',
    samplePrompt: 'Create a travel itinerary for a Japan trip.',
    slides: [
      { type: 'title', title: 'Japan Adventure', subtitle: '10 Days of Wonder' },
      { type: 'two-column', title: 'Tokyo (Days 1-4)', leftContent: ['Shibuya Crossing', 'Senso-ji Temple', 'Akihabara District'], rightContent: ['Tsukiji Market', 'teamLab Borderless', 'Shinjuku Nightlife'] },
      { type: 'two-column', title: 'Kyoto (Days 5-7)', leftContent: ['Fushimi Inari Shrine', 'Arashiyama Bamboo', 'Gion District'], rightContent: ['Kinkaku-ji Temple', 'Tea Ceremony', 'Nishiki Market'] },
      { type: 'bullets', title: 'Travel Tips', bullets: ['Get a JR Pass for trains', 'Cash is still king', 'Learn basic Japanese phrases', 'Book teamLab tickets early!'] },
    ],
  },
  {
    id: 'recipe-book',
    title: 'Recipe Collection',
    description: 'Cookbook style presentation',
    category: 'personal',
    theme: 'magazine',
    samplePrompt: 'Create a recipe presentation for Italian pasta dishes.',
    slides: [
      { type: 'title', title: 'Nonna\'s Pasta', subtitle: 'Authentic Italian Recipes' },
      { type: 'section', title: 'Classic Carbonara' },
      { type: 'two-column', title: 'Ingredients', leftContent: ['400g Spaghetti', '200g Guanciale', '4 Egg Yolks'], rightContent: ['100g Pecorino Romano', 'Black Pepper', 'Salt to taste'] },
      { type: 'bullets', title: 'Instructions', bullets: ['Cook pasta in salted water until al dente', 'Crisp guanciale in pan, remove from heat', 'Mix yolks with cheese and pepper', 'Toss hot pasta with guanciale, then egg mixture', 'Serve immediately with extra cheese'] },
      { type: 'quote', quote: 'The secret is using the pasta water to create the perfect creamy sauce without cream.', attribution: 'Nonna Maria' },
    ],
  },
];

export const getTemplatesByCategory = (category: TemplateCategory): Template[] => {
  return TEMPLATES.filter((t) => t.category === category);
};

export const getAllCategories = (): TemplateCategory[] => {
  return Object.keys(TEMPLATE_CATEGORIES) as TemplateCategory[];
};
