"use client";

import { SlidesProvider } from "@/contexts/SlidesContext";
import { TemplateProvider } from "@/contexts/TemplateContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SlidesProvider>
      <TemplateProvider>{children}</TemplateProvider>
    </SlidesProvider>
  );
}
