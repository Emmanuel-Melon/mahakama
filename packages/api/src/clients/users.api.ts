import { FetchApiClient } from "../fetch";
import type { components } from "../generated/api.types";

export type User = components["schemas"]["User"];
export type UserResource = components["schemas"]["UserResource"];
export type UserSingleResponse = components["schemas"]["UserSingleResponse"];
export type UsersCollectionResponse =
  components["schemas"]["UsersCollectionResponse"];
export type CreateUserRequest = components["schemas"]["CreateUser"];

export class UsersApiClient {
  private api: FetchApiClient;

  constructor(apiClient?: FetchApiClient) {
    this.api = apiClient || new FetchApiClient();
  }

  public async getCurrentUser(): Promise<User> {
    const response = await this.api.request<UserSingleResponse>(`/v1/users/me`);
    if (!response.data.attributes) {
      throw new Error("Invalid user data received from the server");
    }
    return response.data.attributes;
  }

  public async getUserById(userId: string): Promise<User> {
    const response = await this.api.request<UserSingleResponse>(
      `/v1/users/${userId}`,
    );
    if (!response.data.attributes) {
      throw new Error("Invalid user data received from the server");
    }
    return response.data.attributes;
  }

  public async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const response = await this.api.request<UserSingleResponse>(
      `/v1/users/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    if (!response.data.attributes) {
      throw new Error("Invalid user data received from the server");
    }
    return response.data.attributes;
  }
}

export const usersApi = new UsersApiClient();
