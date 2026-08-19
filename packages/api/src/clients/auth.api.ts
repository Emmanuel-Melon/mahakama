import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import { AUTH_API_ROUTES } from "../api.routes";
import type { components } from "../generated/api.types";
import { schemas } from "@mah/api/generated/api.schemas";

/**
 * Generated Types
 */
export type LoginRequest = components["schemas"]["LoginRequest"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];
export type User = components["schemas"]["User"];
export type UserResource = components["schemas"]["UserResource"];
export type UserSingleResponse = components["schemas"]["UserSingleResponse"];
export type UserMetadata = UserSingleResponse["metadata"];
export type UserResult = ApiResource<User, UserMetadata>;

/**
 * Validation Schemas (Zod / OpenAPI Runtime Schemas)
 */
export const loginRequestSchema = schemas.postV1login_Body;
export const registerRequestSchema = schemas.postV1register_Body;

/**
 * Auth API Client
 */
export class AuthApiClient extends BaseApiClient {
  protected readonly path = "";

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async login(credentials: LoginRequest): Promise<UserResult> {
    const response = await this.api.request<UserSingleResponse>(
      AUTH_API_ROUTES.LOGIN,
      {
        method: "POST",
        headers: this.defaultHeaders,
        data: credentials,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid user data received from server",
    });
  }

  public async register(userAttrs: RegisterRequest): Promise<UserResult> {
    const response = await this.api.request<UserSingleResponse>(
      AUTH_API_ROUTES.REGISTER,
      {
        method: "POST",
        headers: this.defaultHeaders,
        data: userAttrs,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid user data received from server",
    });
  }

  public async logout(): Promise<void> {
    return this.api.request<void>(AUTH_API_ROUTES.LOGOUT, {
      method: "POST",
      headers: this.defaultHeaders,
    });
  }
}

let _authApi: AuthApiClient | null = null;
export const authApi = new Proxy({} as AuthApiClient, {
  get(_, prop) {
    if (!_authApi) _authApi = new AuthApiClient();
    return _authApi[prop as keyof AuthApiClient];
  },
});
