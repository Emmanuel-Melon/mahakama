import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import type { components } from "../generated/api.types";

export type User = components["schemas"]["User"];
export type UserResource = components["schemas"]["UserResource"];
export type UserSingleResponse = components["schemas"]["UserSingleResponse"];
export type UsersCollectionResponse =
  components["schemas"]["UserCollectionResponse"];
export type NewUser = components["schemas"]["NewUser"];

export type UserMetadata = UserSingleResponse["metadata"];
export type UserResult = ApiResource<User, UserMetadata>;

export class UsersApiClient extends BaseApiClient {
  protected readonly path = "/v1/users";

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async getCurrentUser(
    options: { headers?: Record<string, string> } = {},
  ): Promise<UserResult> {
    const response = await this.api.request<UserSingleResponse>(
      `${this.path}/me`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid user data received from the server",
    });
  }

  public async getUserById(
    userId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<UserResult> {
    const response = await this.api.request<UserSingleResponse>(
      `${this.path}/${userId}`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid user data received from the server",
    });
  }

  public async updateUser(
    userId: string,
    data: Partial<User>,
    options: { headers?: Record<string, string> } = {},
  ): Promise<UserResult> {
    const response = await this.api.request<UserSingleResponse>(
      `${this.path}/${userId}`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid user data received from the server",
    });
  }
}

let _usersApi: UsersApiClient | null = null;
export const usersApi = new Proxy({} as UsersApiClient, {
  get(_, prop) {
    if (!_usersApi) _usersApi = new UsersApiClient();
    return _usersApi[prop as keyof UsersApiClient];
  },
});
