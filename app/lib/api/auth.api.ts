import type { components } from "./types/api";
import { API_CONFIG } from "~/config";

export type LoginRequest = components["schemas"]["LoginRequest"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];

export type User = components["schemas"]["User"];
export type AuthResponse = components["schemas"]["AuthSuccessResponse"]["data"];
type ErrorResponse = components["schemas"]["ErrorResponse"];

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string | null } };

const API_BASE = API_CONFIG.BASE_URL.replace("/api", "");

export class AuthApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    console.log("Making request to:", url);
    console.log("Request options:", {
      ...options,
      headers,
      credentials: "include",
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      console.log("Response status:", response.status, response.statusText);
      console.log("Response headers:");
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });

      const data = (await response.json()) as ApiResponse<T>;
      console.log("Response data:", data);

      if (!response.ok || !data.success) {
        const errorMessage =
          "error" in data
            ? data.error.message
            : `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    return response;
  }

  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return response;
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.request<{ user: User }>("/api/v1/auth/me", {
        method: "GET",
      });
      return response.user;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      return null;
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.request<void>("/api/v1/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }
}

export const authApi = new AuthApiClient();
