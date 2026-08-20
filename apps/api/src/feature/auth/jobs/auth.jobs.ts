import { logger } from "@/lib/logger";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { insertAuthEvent } from "../operations/auth.insert";
import {
  EmailVerifiedPayload,
  GenerateVerificationLinkPayload,
  LoggedInPayload,
  LoggedOutPayload,
  RefreshTokenPayload,
  RegistrationCompletedPayload,
  ResetPasswordRequestPayload,
} from "../auth.types";
import {
  dispatchAuthNotification,
  AuthNotificationEvent,
} from "../notifications/auth.notifications";
import { generateSecureToken } from "@/service/token-service/operations/tokens.insert";
import { convertDuration } from "@/utils/dates";
import { clientConfig } from "@/config";
import { findAuthUser } from "../operations/auth.find";

const TOKEN_EXPIRY_DAYS = 1;
const verifyEmailUrl = `${clientConfig.baseUrl}/verify-email`;
const resetPasswordUrl = `${clientConfig.baseUrl}/reset-password`;

export class AuthJobHandler {
  static async handleLogin(data: LoggedInPayload) {
    const authEvent = unwrapJobResult(
      await insertAuthEvent({
        userId: data.userId,
        eventType: "login",
        createdAt: new Date(),
      }),
      { message: "Could not create auth event", shouldRetry: true },
    );

    logger.info(
      { userId: data.userId, authEventId: authEvent.data?.id },
      "Processing login alert",
    );

    await dispatchAuthNotification(
      AuthNotificationEvent.LoginAlert,
      { loginTime: new Date().toISOString() },
      {
        recipientId: data.userId,
        correlationId: authEvent.data?.id!,
      },
    );

    return { success: true };
  }

  static async handleRegistration(data: RegistrationCompletedPayload) {
    logger.info({ userId: data.userId }, "Processing registration");

    const link = await generateSecureToken({
      userId: data.userId,
      tokenType: "LINK",
      entityType: "user",
      entityId: data.userId,
      expiresInMinutes: convertDuration(TOKEN_EXPIRY_DAYS, "days", "minutes"),
      baseUrl: verifyEmailUrl,
    });

    await dispatchAuthNotification(
      AuthNotificationEvent.EmailVerification,
      { email: data.email, link },
      { recipientId: data.userId, correlationId: data.userId },
    );

    return { success: true };
  }

  static async handleTokenRefresh(data: RefreshTokenPayload) {
    logger.info({ userId: data.userId }, "Processing token refresh");
    return { success: true };
  }

  static async handleLogout(data: LoggedOutPayload) {
    logger.info({ userId: data.userId }, "Processing logout");
    return { success: true };
  }

  static async handleResetPasswordRequest(data: ResetPasswordRequestPayload) {
    logger.info(
      { userId: data.userId, email: data.email },
      "Processing password reset request",
    );

    const link = await generateSecureToken({
      userId: data.userId,
      tokenType: "LINK",
      entityType: "user",
      entityId: data.userId,
      expiresInMinutes: convertDuration(TOKEN_EXPIRY_DAYS, "days", "minutes"),
      baseUrl: resetPasswordUrl,
    });

    await dispatchAuthNotification(
      AuthNotificationEvent.PasswordReset,
      { email: data.email, link },
      {
        recipientId: data.userId,
        correlationId: data.correlationId,
      },
    );

    return { success: true };
  }

  static async handleEmailVerified(data: EmailVerifiedPayload) {
    logger.info({ userId: data.userId }, "Processing email verified");
    return { success: true };
  }

  static async generateVerificationLinkEvent(
    data: GenerateVerificationLinkPayload,
  ) {
    logger.info({ userId: data.userId }, "Processing email verification link");

    const user = await findAuthUser("id", data.userId);
    if (!user.ok || !user.data?.email) {
      logger.error(
        { userId: data.userId },
        "User not found for verification link",
      );
      return { success: false };
    }

    const link = await generateSecureToken({
      userId: data.userId,
      tokenType: "LINK",
      entityType: "user",
      entityId: data.userId,
      expiresInMinutes: convertDuration(TOKEN_EXPIRY_DAYS, "days", "minutes"),
      baseUrl: verifyEmailUrl,
    });

    await dispatchAuthNotification(
      AuthNotificationEvent.EmailVerification,
      { email: user.data.email, link },
      { recipientId: data.userId, correlationId: data.userId },
    );

    return { success: true };
  }
}
