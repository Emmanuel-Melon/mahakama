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
  constructor() {
    this.api = new FetchApiClient({ baseUrl: "http://localhost:3000" });
  }
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.api.request<AuthResponse>(AUTH_API_ROUTES.LOGIN, {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (!response) {
        console.error("Invalid auth data:", response);
        throw new Error("Invalid auth data received from the server");
      }
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  public async register(userAttrs: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.api.request<AuthResponse>(AUTH_API_ROUTES.REGISTER, {
        method: "POST",
        body: JSON.stringify(userAttrs),
      });

      if (!response) {
        console.error("Invalid auth data:", response);
        throw new Error("Invalid auth data received from the server");
      }
      return response;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.api.request<void>(AUTH_API_ROUTES.LOGOUT, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }
}

export const authApi = new AuthApiClient();
