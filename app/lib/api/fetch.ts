import { API_CONFIG } from "~/config";
import type { components, paths } from "./types/api";

export const DEFAULT_TIMEOUT = 5000;

// Use the generated ErrorResponse type
export type ErrorResponse = components["schemas"]["ErrorResponse"];

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class FetchApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(
    config: {
      baseUrl?: string;
      apiKey?: string;
    } = {},
  ) {
    this.baseUrl = config.baseUrl || API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          success: false,
          error: {
            message: `Request failed with status ${response.status}`,
            code: null,
          },
        };
      }
      throw new Error(
        errorData.error?.message ||
          `Request failed with status ${response.status}`,
      );
    }
    return response.json();
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return this.handleResponse<T>(response);
  }
}

export const fetchApi = new FetchApiClient();
