'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateGallery, TemplateCustomizer } from '@/components/organisms/templates';
import { useSlides } from '@/contexts/SlidesContext';
import { TemplateRepository } from '@/lib/api/repositories';
import { Layers, ArrowLeft, Search, X } from 'lucide-react';
import Link from 'next/link';
import type { Template, TemplateGenerateRequest } from '@/lib/types/template';

export default function TemplatesPage() {
  const router = useRouter();
  const { generateFromTemplate } = useSlides();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTemplate = async (template: Template) => {
    // If it's a list item, fetch full template
    if (!('slides' in template) || !template.slides) {
      try {
        const fullTemplate = await TemplateRepository.getById(template.id);
        setSelectedTemplate(fullTemplate);
      } catch (err) {
        console.error('Failed to load template:', err);
        return;
      }
    } else {
      setSelectedTemplate(template);
    }
    setShowCustomizer(true);
  };

  const handleCloseCustomizer = () => {
    setShowCustomizer(false);
  };

  const handleGenerate = useCallback(
    async (templateId: number, request: TemplateGenerateRequest) => {
      setIsGenerating(true);
      setShowCustomizer(false);

      try {
        // Start streaming generation via context - this will update agentEvents
        // Don't await - let it run and navigate immediately
        generateFromTemplate(templateId, request);

        // Navigate to /app to show the agent progress
        router.push('/app');
      } catch (error) {
        console.error('Generation failed:', error);
        setIsGenerating(false);
        throw error;
      }
    },
    [router, generateFromTemplate]
  );

  return (
    <main className="min-h-[calc(100vh-64px)] bg-bg-primary">
      {/* Header */}
      <div className="border-b-2 border-border-light bg-bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/app"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to App
              </Link>
              <div className="h-6 w-px bg-border-light" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-bg-dark rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#ff90e8]">
                  <Layers className="w-4 h-4 text-text-inverse" />
                </div>
                <h1 className="text-xl font-bold text-text-primary">Template Library</h1>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-10 py-2 text-sm border-2 border-border-light rounded-lg focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-bg-tertiary"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Template Gallery */}
        <div className="animate-fade-in">
          <div className="mb-6">
            <p className="text-text-secondary">
              Choose a template to get started quickly. Customize it with your content and generate a professional presentation.
            </p>
          </div>

          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
          />
        </div>
      </div>

      {/* Template Customizer Modal */}
      {selectedTemplate && (
        <TemplateCustomizer
          template={selectedTemplate}
          isOpen={showCustomizer}
          onClose={handleCloseCustomizer}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      )}
    </main>
  );
}
