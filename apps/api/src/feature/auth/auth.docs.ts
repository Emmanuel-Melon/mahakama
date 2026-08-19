import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import { registerRoutes } from "@/lib/openapi/openapi.core";
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
} from "./auth.types";

export const authRegistry = new OpenAPIRegistry();

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
authRegistry.register("AuthUser", authUserSelectSchema);
authRegistry.register("AuthHeaders", authHeadersSchema);
authRegistry.register("ResetPasswordResponse", resetPasswordSchema);
authRegistry.register("EmailVerificationStatus", emailVerificationStatusSchema);
authRegistry.register("RefreshTokenSelect", refreshTokenSelectSchema);
