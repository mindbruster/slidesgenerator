"use client";

import { SlidesProvider } from "@/contexts/SlidesContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <SlidesProvider>{children}</SlidesProvider>;
}
