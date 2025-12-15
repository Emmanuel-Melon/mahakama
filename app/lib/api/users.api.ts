import { FetchApiClient } from "./fetch";
import type { components } from "./generated/api.types";

export type User = components["schemas"]["User"];
export type UserResource = components["schemas"]["UserResource"];
export type UserSingleResponse = components["schemas"]["UserSingleResponse"];
export type UsersCollectionResponse = components["schemas"]["UsersCollectionResponse"];
export type CreateUserRequest = components["schemas"]["CreateUser"];

export class UsersApiClient {
  private api: FetchApiClient;
  constructor() {
    this.api = new FetchApiClient();
  }

  public async getCurrentUser(
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<User> {
    try {
      const response = await this.api.request<UserSingleResponse>(`/v1/users/me`, {
        headers: options.headers,
      });

      if (!response.data.attributes) {
        console.error("Invalid user data:", response);
        throw new Error("Invalid user data received from the server");
      }
      return response.data.attributes;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  }

  public async getUserById(
    userId: string,
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<User> {
    try {
      const response = await this.api.request<UserSingleResponse>(`/v1/users/${userId}`, {
        headers: options.headers,
      });

      if (!response.data.attributes) {
        console.error("Invalid user data:", response);
        throw new Error("Invalid user data received from the server");
      }
      return response.data.attributes;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  }

  public async getAllUsers(
    params: { headers: HeadersInit; } | undefined, options: { headers: HeadersInit; } = { headers: {} },
  ): Promise<{ users: User[]; metadata: UsersCollectionResponse["metadata"] }> {
    try {
      const response = await this.api.request<UsersCollectionResponse>(`/v1/users`, {
        headers: options.headers,
      });
      if (!response.data) {
        console.error("Invalid users data:", response);
        throw new Error("Invalid users data received from the server");
      }
      const users = response.data.map((resource) => resource.attributes);
      return {
        users,
        metadata: response.metadata,
      };
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  }

  public async updateUser(
    userId: string,
    data: Partial<User>,
    params: { headers: HeadersInit; } | undefined, options: { headers: HeadersInit; } = { headers: {} },
  ): Promise<User> {
    try {
      const response = await this.api.request<UserSingleResponse>(`/v1/users/${userId}`, {
        method: 'PUT',
        headers: options.headers,
        body: JSON.stringify(data),
      });
      if (!response.data.attributes) {
        console.error("Invalid user data:", response);
        throw new Error("Invalid user data received from the server");
      }
      return response.data.attributes;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }
}

export const usersApi = new UsersApiClient();
