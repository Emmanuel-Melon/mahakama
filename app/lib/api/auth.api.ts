import { AUTH_API_ROUTES } from "~/feature/auth/AuthConfig";
import { FetchApiClient } from "~/lib/api/fetch";
import type { components } from "~/lib/api/generated/api.types";

export type LoginRequest = components["schemas"]["LoginRequest"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];
export type User = components["schemas"]["User"];
export type AuthResponse = components["schemas"]["AuthResponse"];
export type UserResource = components["schemas"]["UserResource"];
export type UserSingleResponse = components["schemas"]["UserSingleResponse"];

export class AuthApiClient {
  private api: FetchApiClient;
  
  constructor(apiClient?: FetchApiClient) {
    // If a custom client is provided, use it; otherwise create one with auth base URL
    if (apiClient) {
      this.api = apiClient;
    } else {
      const authBaseURL = import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:3000/auth";
      this.api = new FetchApiClient({}, authBaseURL);
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // For auth endpoints, don't include credentials to avoid sending existing auth cookies
    return await this.api.request<T>(endpoint, {
      ...options,
      credentials: 'omit', // Don't send cookies for auth requests
    });
  }

  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await this.makeRequest<AuthResponse>(AUTH_API_ROUTES.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  public async register(userAttrs: RegisterRequest): Promise<AuthResponse> {
    return await this.makeRequest<AuthResponse>(AUTH_API_ROUTES.REGISTER, {
      method: "POST",
      body: JSON.stringify(userAttrs),
    });
  }

  public async logout(): Promise<void> {
    await this.makeRequest<void>(AUTH_API_ROUTES.LOGOUT, {
      method: "POST",
    });
  }
}

export const authApi = new AuthApiClient();