/**
 * Slides API Repository
 * Handles all slide and presentation API calls
 */

import { apiClient } from "../client";
import type {
  GenerateSlidesRequest,
  GenerateSlidesResponse,
  Presentation,
  SlideUpdate,
  AgentEvent,
} from "@/lib/types";

export const SlidesRepository = {
  /**
   * Generate slides from text
   */
  async generate(request: GenerateSlidesRequest): Promise<GenerateSlidesResponse> {
    return apiClient.post<GenerateSlidesResponse>("/api/v1/slides/generate", request);
  },

  /**
   * Generate slides with SSE streaming for real-time progress
   */
  async generateStream(
    request: GenerateSlidesRequest,
    onEvent: (event: AgentEvent) => void
  ): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18000";
    const response = await fetch(`${baseUrl}/api/v1/slides/generate/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            onEvent(data as AgentEvent);
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
  },

  /**
   * Get all presentations
   */
  async listPresentations(skip = 0, limit = 50): Promise<Presentation[]> {
    return apiClient.get<Presentation[]>(
      `/api/v1/presentations?skip=${skip}&limit=${limit}`
    );
  },

  /**
   * Get a single presentation by ID
   */
  async getPresentation(id: number): Promise<Presentation> {
    return apiClient.get<Presentation>(`/api/v1/presentations/${id}`);
  },

  /**
   * Update a presentation
   */
  async updatePresentation(
    id: number,
    data: { title?: string; theme?: string }
  ): Promise<Presentation> {
    return apiClient.put<Presentation>(`/api/v1/presentations/${id}`, data);
  },

  /**
   * Delete a presentation
   */
  async deletePresentation(id: number): Promise<void> {
    return apiClient.delete(`/api/v1/presentations/${id}`);
  },

  /**
   * Update a specific slide
   */
  async updateSlide(
    presentationId: number,
    slideIndex: number,
    data: SlideUpdate
  ): Promise<Presentation> {
    return apiClient.put<Presentation>(
      `/api/v1/presentations/${presentationId}/slides/${slideIndex}`,
      data
    );
  },

  /**
   * Create shareable link for presentation
   */
  async createShareLink(presentationId: number): Promise<{ url: string; share_code: string }> {
    return apiClient.post(`/api/v1/export/link/${presentationId}`);
  },

  /**
   * Get PDF export URL (triggers download)
   */
  getPdfUrl(presentationId: number): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18000";
    return `${baseUrl}/api/v1/export/pdf/${presentationId}`;
  },
};
