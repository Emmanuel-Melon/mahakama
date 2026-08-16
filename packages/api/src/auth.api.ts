import { AUTH_API_ROUTES } from "./api.routes";
import { FetchApiClient } from "./fetch";
import type { components } from "./generated/api.types";

export type LoginRequest = components["schemas"]["LoginRequest"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];
export type User = components["schemas"]["User"];
export type AuthResponse = components["schemas"]["AuthResponse"];
export type UserResource = components["schemas"]["UserResource"];
export type UserSingleResponse = components["schemas"]["UserSingleResponse"];

export class AuthApiClient {
  private api: FetchApiClient;
  constructor(apiClient?: FetchApiClient) {
    if (apiClient) {
      this.api = apiClient;
    } else {
      const authBaseURL = import.meta.env.VITE_AUTH_BASE_URL;
      this.api = new FetchApiClient({}, authBaseURL);
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    return await this.api.request<T>(endpoint, {
      ...options,
      credentials: "include",
    });
  }

  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await this.makeRequest<AuthResponse>(AUTH_API_ROUTES.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
      credentials: "include",
    });
  }

  public async register(userAttrs: RegisterRequest): Promise<AuthResponse> {
    return await this.makeRequest<AuthResponse>(AUTH_API_ROUTES.REGISTER, {
      method: "POST",
      body: JSON.stringify(userAttrs),
      credentials: "include",
    });
  }

  public async logout(): Promise<void> {
    await this.makeRequest<void>(AUTH_API_ROUTES.LOGOUT, {
      method: "POST",
      credentials: "include",
    });
  }
}

export const authApi = new AuthApiClient();
