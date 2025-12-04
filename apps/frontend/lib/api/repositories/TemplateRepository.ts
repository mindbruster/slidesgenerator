/**
 * Template API Repository
 * Handles all template-related API calls
 */

import { apiClient } from "../client";
import type {
  Template,
  TemplateListItem,
  TemplateCreateRequest,
  TemplateUpdateRequest,
  TemplateGenerateRequest,
  CategoryCount,
  GenerateSlidesResponse,
  AgentEvent,
} from "@/lib/types";

export interface ListTemplatesParams {
  category?: string;
  theme?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

export const TemplateRepository = {
  /**
   * List templates with optional filters
   */
  async list(params: ListTemplatesParams = {}): Promise<TemplateListItem[]> {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set("category", params.category);
    if (params.theme) searchParams.set("theme", params.theme);
    if (params.search) searchParams.set("search", params.search);
    if (params.skip) searchParams.set("skip", params.skip.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());

    const query = searchParams.toString();
    const url = `/api/v1/templates${query ? `?${query}` : ""}`;
    return apiClient.get<TemplateListItem[]>(url);
  },

  /**
   * Get template categories with counts
   */
  async getCategories(): Promise<CategoryCount[]> {
    return apiClient.get<CategoryCount[]>("/api/v1/templates/categories");
  },

  /**
   * Get popular templates
   */
  async getPopular(limit = 10): Promise<TemplateListItem[]> {
    return apiClient.get<TemplateListItem[]>(
      `/api/v1/templates/popular?limit=${limit}`
    );
  },

  /**
   * Get a single template by ID with all slides
   */
  async getById(id: number): Promise<Template> {
    return apiClient.get<Template>(`/api/v1/templates/${id}`);
  },

  /**
   * Create a new template
   */
  async create(data: TemplateCreateRequest): Promise<Template> {
    return apiClient.post<Template>("/api/v1/templates", data);
  },

  /**
   * Update a template
   */
  async update(id: number, data: TemplateUpdateRequest): Promise<Template> {
    return apiClient.put<Template>(`/api/v1/templates/${id}`, data);
  },

  /**
   * Delete a template
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete(`/api/v1/templates/${id}`);
  },

  /**
   * Generate presentation from template
   */
  async generate(
    templateId: number,
    request: TemplateGenerateRequest
  ): Promise<GenerateSlidesResponse> {
    return apiClient.post<GenerateSlidesResponse>(
      `/api/v1/templates/${templateId}/generate`,
      request
    );
  },

  /**
   * Generate presentation from template with SSE streaming
   */
  async generateStream(
    templateId: number,
    request: TemplateGenerateRequest,
    onEvent: (event: AgentEvent) => void
  ): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18000";
    const response = await fetch(
      `${baseUrl}/api/v1/templates/${templateId}/generate/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Process SSE stream
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
            // Skip invalid JSON
          }
        }
      }
    }
  },
};
