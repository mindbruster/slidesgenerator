/**
 * API Client configuration
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18000";

interface FetchOptions extends RequestInit {
  json?: unknown;
}

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { json, ...fetchOptions } = options;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
      body: json ? JSON.stringify(json) : options.body,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "POST", json: data });
  }

  async put<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "PUT", json: data });
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new APIClient(API_URL);
