import { FetchApiClient } from "./fetch";
import type { components } from "./types/api1";

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
      const response = await this.api.request<AuthResponse>("/auth/v1/login", {
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

  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.api.request<AuthResponse>("/auth/v1/register", {
        method: "POST",
        body: JSON.stringify(userData),
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
      await this.api.request<void>("/auth/v1/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }
}

export const authApi = new AuthApiClient();
