import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { authApi } from "./auth.routes";
import {
  registerRequestSchema,
  loginRequestSchema,
  passwordResetRequestSchema,
  newPasswordSchema,
  verifyEmailBodySchema,
  authUserSelectSchema,
  authHeadersSchema,
  resetPasswordSchema,
  emailVerificationStatusSchema,
  refreshTokenSelectSchema,
  signupUserSchema,
  loginUserSchema,
  authResponseSchema,
  UserRoleSchema,
  BaseTokenPayloadSchema,
  AccessPayloadSchema,
  RefreshPayloadSchema,
  AuthPayloadSchema,
  TokenGenerationArgsSchema,
  authEventQuerySchema,
} from "./auth.types";

// 1. Define a schema for the resend verification request body if you haven't yet
const resendVerificationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const authRegistry = new OpenAPIRegistry();

export const authSchemas = {
  kind: "action" as const,
  requests: {
    signup: signupUserSchema,
    login: loginUserSchema,
    logout: z.object({}),
    refresh: z.object({}),
    me: z.object({}),
    resetPasswordRequest: passwordResetRequestSchema,
  },
  response: authResponseSchema,
};

const refreshTokenApiResource = defineApiResource({
  select: refreshTokenSelectSchema,
  // no insert/update needed
});

// Register schemas
export const RefreshTokenApiSchemas = registerJsonApiSchemas({
  registry: authRegistry,
  resourceType: "refreshToken",
  pascalName: "RefreshToken",
  schemas: refreshTokenApiResource,
});

const emailVerificationStatusApiResource = defineApiResource({
  select: emailVerificationStatusSchema,
  // no insert/update needed
});

export const EmailVerificationStatusApiSchemas = registerJsonApiSchemas({
  registry: authRegistry,
  resourceType: "emailVerificationStatus",
  pascalName: "EmailVerificationStatus",
  schemas: emailVerificationStatusApiResource,
});

export const AuthApiSchemas = registerJsonApiSchemas({
  registry: authRegistry,
  resourceType: "auth",
  pascalName: "Auth",
  schemas: authSchemas,
});

const authPaths: PathDefinition[] = [
  {
    handlerName: "signupController",
    method: "post",
    path: `${authApi.path}/register`,
    summary: "Register a new user",
    description: "Creates a new user account profile",
    security: [],
    requestBodySchema: registerRequestSchema,
    successStatus: HttpStatus.CREATED,
    successSchema: registerRequestSchema,
    errorCodes: [400, 409, 500],
  },
  {
    handlerName: "loginController",
    method: "post",
    path: `${authApi.path}/login`,
    summary: "Login user",
    description: "Authenticates an existing user account",
    security: [],
    requestBodySchema: loginRequestSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: loginRequestSchema,
    errorCodes: [400, 401, 500],
  },
  {
    handlerName: "logoutController",
    method: "post",
    path: `${authApi.path}/logout`,
    summary: "Logout user",
    description: "Revokes the current session and clears auth cookies",
    requestBodySchema: z.object({}),
    successStatus: HttpStatus.NO_CONTENT,
    errorCodes: [401],
  },
  {
    handlerName: "getMeController",
    method: "get",
    path: `${authApi.path}/me`,
    summary: "Get current user",
    description: "Returns the authenticated user's profile",
    successStatus: HttpStatus.SUCCESS,
    errorCodes: [401, 404],
  },
  {
    handlerName: "refreshController",
    method: "post",
    path: `${authApi.path}/refresh`,
    summary: "Refresh access token",
    description:
      "Issues a new access and refresh token pair using the current refresh token cookie",
    security: [],
    successStatus: HttpStatus.CREATED,
    errorCodes: [401],
  },
  {
    handlerName: "requestResetController",
    method: "post",
    path: `${authApi.path}/request-reset`,
    summary: "Request password reset",
    description:
      "Sends a password recovery email if an account matches the given address",
    security: [],
    requestBodySchema: passwordResetRequestSchema,
    successStatus: HttpStatus.ACCEPTED,
    successSchema: passwordResetRequestSchema,
    errorCodes: [400, 500],
  },
  {
    handlerName: "resetPasswordController",
    method: "post",
    path: `${authApi.path}/reset-password`,
    summary: "Reset password",
    description: "Resets the user's password using a valid recovery token",
    security: [],
    requestBodySchema: newPasswordSchema,
    successStatus: HttpStatus.NO_CONTENT,
    errorCodes: [400, 410, 500],
  },
  {
    handlerName: "verifyEmailController",
    method: "post",
    path: `${authApi.path}/verify-email`,
    summary: "Verify email address",
    description: "Verifies a user's email address using a verification token",
    security: [],
    requestBodySchema: verifyEmailBodySchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: verifyEmailBodySchema,
    errorCodes: [400, 429],
  },
  {
    handlerName: "resendVerification",
    method: "post",
    path: `${authApi.path}/resend-verification`,
    summary: "Resend verification email",
    description:
      "Queues a new verification email for the specified user account",
    security: [],
    requestBodySchema: resendVerificationSchema,
    successStatus: HttpStatus.ACCEPTED,
    successSchema: z.object({ message: z.string() }),
    errorCodes: [400, 404, 500],
  },
];

registerRoutes({
  registry: authRegistry,
  defaultTag: "Authentication",
  routes: authPaths,
});

authRegistry.register("RegisterRequest", registerRequestSchema);
authRegistry.register("LoginRequest", loginRequestSchema);
authRegistry.register("PasswordResetRequest", passwordResetRequestSchema);
authRegistry.register("NewPasswordRequest", newPasswordSchema);
authRegistry.register("VerifyEmailRequest", verifyEmailBodySchema);
authRegistry.register("ResendVerificationRequest", resendVerificationSchema);
authRegistry.register("AuthUser", authUserSelectSchema);
authRegistry.register("AuthHeaders", authHeadersSchema);
authRegistry.register("ResetPasswordResponse", resetPasswordSchema);
authRegistry.register("EmailVerificationStatus", emailVerificationStatusSchema);
authRegistry.register("RefreshTokenSelect", refreshTokenSelectSchema);
authRegistry.registerComponent("securitySchemes", "cookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: "token",
  description:
    "Authentication via secure, short-lived HTTP-Only access cookies.",
});
authRegistry.registerComponent("securitySchemes", "refreshCookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: "refreshToken",
  description:
    "Session renewal via long-lived HTTP-Only refresh cookie scoped to the refresh endpoint.",
});
authRegistry.register("UserRole", UserRoleSchema);
authRegistry.register("BaseTokenPayload", BaseTokenPayloadSchema);
authRegistry.register("AccessPayload", AccessPayloadSchema);
authRegistry.register("RefreshPayload", RefreshPayloadSchema);
authRegistry.register("AuthPayload", AuthPayloadSchema);
authRegistry.register("TokenGenerationArgs", TokenGenerationArgsSchema);
authRegistry.register("AuthEventQuery", authEventQuerySchema);
