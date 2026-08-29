import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import { AUTH_API_ROUTES } from "../api.routes";
import type { components } from "../generated/api.types";
import { schemas } from "../generated/api.schemas";

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
export type NewPasswordRequest = components["schemas"]["NewPasswordRequest"];
export type VerifyEmailRequest = components["schemas"]["VerifyEmailRequest"];
export type ResetPasswordResult = {
  message: string;
  deliveryEstimate: number;
};
export type EmailVerificationStatus =
  components["schemas"]["EmailVerificationStatus"];
export type EmailVerificationStatusSingleResponse =
  components["schemas"]["EmailVerificationStatusSingleResponse"];
export type EmailVerificationStatusMetadata =
  components["schemas"]["EmailVerificationStatusSingleResponse"]["metadata"];
export type EmailVerificationStatusResult = ApiResource<
  EmailVerificationStatus,
  EmailVerificationStatusMetadata
>;
export type UserRole = components["schemas"]["UserRole"];
export type BaseTokenPayload = components["schemas"]["BaseTokenPayload"];
export type AccessPayload = components["schemas"]["AccessPayload"];
export type RefreshPayload = components["schemas"]["RefreshPayload"];
export type AuthPayload = components["schemas"]["AuthPayload"];
export type TokenGenerationArgs = components["schemas"]["TokenGenerationArgs"];
export type AuthEventQuery = components["schemas"]["AuthEventQuery"];

/**
 * Validation Schemas (Zod / OpenAPI Runtime Schemas)
 */
export const loginRequestSchema = schemas.postV1authlogin_Body;
export const registerRequestSchema = schemas.postV1authregister_Body;

/**
 * Auth API Client
 */
export class AuthApiClient extends BaseApiClient {
  protected readonly path = "v1/auth";

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

  public async getMe(): Promise<UserResult> {
    const response = await this.api.request<UserSingleResponse>(
      AUTH_API_ROUTES.ME,
      {
        headers: this.defaultHeaders,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid user data received from server",
    });
  }

  public async resetPasswordRequest(
    email: string,
  ): Promise<ResetPasswordResult> {
    return this.api.request<ResetPasswordResult>(
      AUTH_API_ROUTES.REQUEST_RESET,
      {
        method: "POST",
        headers: this.defaultHeaders,
        data: { email },
      },
    );
  }

  public async resetPassword(token: string, password: string): Promise<void> {
    return this.api.request<void>(AUTH_API_ROUTES.RESET_PASSWORD, {
      method: "POST",
      headers: this.defaultHeaders,
      data: { token, password },
    });
  }

  public async verifyEmail(token: string): Promise<void> {
    return this.api.request<void>(AUTH_API_ROUTES.VERIFY_EMAIL, {
      method: "POST",
      headers: this.defaultHeaders,
      data: { token },
    });
  }

  public async resendVerification(
    email: string,
  ): Promise<EmailVerificationStatusResult> {
    const response =
      await this.api.request<EmailVerificationStatusSingleResponse>(
        `${this.path}/resend-verification`,
        {
          method: "POST",
          data: { email },
        },
      );
    return this.unpackSingle(response, {
      errMsg: "Failed to queue verification email",
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
