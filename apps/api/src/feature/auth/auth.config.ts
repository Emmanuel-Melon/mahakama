import { JsonApiResourceConfig } from "@/lib/express/express.types";

import type {
  EmailVerificationStatus,
  RefreshToken,
  ResetPasswordPayload,
  UserRole,
} from "./auth.types";

export const AuthJobs = {
  LoggedIn: "auth-logged-in",
  LoggedOut: "auth-logged-out",
  RegistrationCompleted: "auth-registration-completed",
  EmailVerified: "auth-email-verified",
  RefreshToken: "auth-refresh-token",
  ResetPasswordRequest: "auth-reset-password-request",
  GenerateVerificationLink: "auth-generate-verification-link",
} as const;

export type AuthJobType = (typeof AuthJobs)[keyof typeof AuthJobs];

export const AUTH_COOKIES: Record<UserRole, string> = {
  admin: "admin_accessToken",
  user: "user_accessToken",
  lawyer: "lawyer_accessToken",
} as const;

export const TIME_IN_MS = {
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  THIRTY_DAYS: 30 * 24 * 60 * 60 * 1000,
} as const;

export const AUTH_AUDIENCE = {
  USER: "mah-app-user",
  LAWYER: "mah-app-lawyer",
  ADMIN: "mah-app-admin",
} as const;

export const AUTH_ISSUER = "ivyi-auth-service";

export const SerializedRefreshToken: JsonApiResourceConfig<RefreshToken> = {
  type: "refreshToken",
  attributes: (payload: RefreshToken) => payload,
};

export const SerializedResetPassword: JsonApiResourceConfig<ResetPasswordPayload> =
  {
    type: "resetPassword",
    attributes: (payload) => payload,
  };

export const SerializedStatus: JsonApiResourceConfig<EmailVerificationStatus> =
  {
    type: "status",
    attributes: (payload: EmailVerificationStatus) => payload,
  };
