import { API_CONFIG } from '~/config';

export const DEFAULT_TIMEOUT = 5000; // api request timeout (5 seconds)

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}


export class FetchApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(config: {
    baseUrl?: string;
    apiKey?: string;
  } = {}) {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }
    return response.json();
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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