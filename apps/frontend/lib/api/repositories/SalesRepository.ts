/**
 * Sales API Repository
 * Handles all sales pitch generation API calls
 */

import { apiClient } from '../client';
import type {
  GenerateSalesPitchRequest,
  SalesPitchTextResponse,
  AgentEvent,
} from '@/lib/types';
import type { GenerateSlidesResponse } from '@/lib/types/slide';

export const SalesRepository = {
  /**
   * Preview generated sales content before creating slides
   */
  async preview(request: GenerateSalesPitchRequest): Promise<SalesPitchTextResponse> {
    return apiClient.post<SalesPitchTextResponse>('/api/v1/sales/preview', request);
  },

  /**
   * Generate a complete sales presentation
   */
  async generate(request: GenerateSalesPitchRequest): Promise<GenerateSlidesResponse> {
    return apiClient.post<GenerateSlidesResponse>('/api/v1/sales/generate', request);
  },

  /**
   * Generate sales presentation with SSE streaming for real-time progress
   */
  async generateStream(
    request: GenerateSalesPitchRequest,
    onEvent: (event: AgentEvent) => void
  ): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:18000';
    const response = await fetch(`${baseUrl}/api/v1/sales/generate/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await this._processSSEStream(response, onEvent);
  },

  /**
   * Process SSE stream from response
   */
  async _processSSEStream(
    response: Response,
    onEvent: (event: AgentEvent) => void
  ): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
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
};
