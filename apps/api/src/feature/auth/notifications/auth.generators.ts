import { createNotificationGenerators } from "@/feature/notifications/notifications.core";

import {
  EmailVerificationNotificationSchema,
  LoginAlertNotificationSchema,
  PasswordResetNotificationSchema,
} from "../auth.types";
import { authEmailRenderers } from "./auth.emails";

export const AuthNotificationTemplates = {
  LOGIN_ALERT: {
    key: "LOGIN_ALERT",
    schema: LoginAlertNotificationSchema,
  },
  PASSWORD_RESET: {
    key: "PASSWORD_RESET",
    schema: PasswordResetNotificationSchema,
  },
  EMAIL_VERIFICATION: {
    key: "EMAIL_VERIFICATION",
    schema: EmailVerificationNotificationSchema,
  },
} as const;

export const authNotificationGenerators = createNotificationGenerators(
  AuthNotificationTemplates,
)({
  LOGIN_ALERT: (data) => ({
    title: "Welcome! Your first login was successful",
    message: `We're glad to have you here! Your account was successfully accessed.`,
    emailHtml: authEmailRenderers.loginAlert(data),
    action: {
      label: "Review Activity",
      url: `/auth/security/${data.actorId}`,
      type: "primary" as const,
    },
    metadata: {
      loginTime: data.loginTime,
      location: data.location,
      device: data.device,
      actorId: data.actorId,
    },
  }),

  PASSWORD_RESET: (data) => ({
    title: "Reset Your Password",
    message:
      "We received a request to reset your password. Click below to proceed.",
    emailHtml: authEmailRenderers.passwordReset(data),
    action: {
      label: "Reset Password",
      url: `/reset-password?email=${encodeURIComponent(data.email)}`,
      type: "primary" as const,
    },
  }),

  EMAIL_VERIFICATION: (data) => ({
    title: "Verify Your Email",
    message: "Please verify your email address to complete your registration.",
    emailHtml: authEmailRenderers.emailVerification(data),
    action: {
      label: "Verify Email",
      url: data.link,
      type: "primary" as const,
    },
  }),
});
