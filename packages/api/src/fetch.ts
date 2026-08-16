import { getAuthToken, parseCookies } from "./api.utils";
import type { components } from "./generated/api.types";

export const DEFAULT_TIMEOUT = 5000;

export type JsonApiErrorResponse =
  components["schemas"]["JsonApiErrorResponse"];
export type JsonApiError = components["schemas"]["JsonApiError"];

export interface ApiError {
  title: string;
  detail: string | null;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class FetchApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  private getClientToken(): string | null {
    if (typeof document === "undefined") return null;
    const cookies = parseCookies(document.cookie);
    return cookies.token ?? null;
  }

  constructor(defaultHeaders: HeadersInit = {}, baseURL?: string) {
    this.baseURL =
      baseURL ||
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:3000/api";
    this.defaultHeaders = defaultHeaders;
  }

  static withAuth(token: string): FetchApiClient {
    return new FetchApiClient({
      Authorization: `Bearer ${token}`,
    });
  }
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: { errors: ApiError[] };
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          errors: [
            {
              title: `Request failed with status ${response.status}`,
              detail: null,
              status: response.status.toString(),
            },
          ],
        };
      }
      throw new Error(
        errorData.errors?.[0]?.detail ||
          `Request failed with status ${response.status}`,
      );
    }
    return response.json();
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    loaderToken?: string,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = loaderToken || this.getClientToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...this.defaultHeaders,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }
}

export const fetchApi = new FetchApiClient();
