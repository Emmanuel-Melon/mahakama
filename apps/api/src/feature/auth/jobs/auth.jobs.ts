import { logger } from "@/lib/logger";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { insertAuthEvent } from "../operations/auth.insert";
import { AuthJobs } from "../auth.config";
import {
  EmailVerifiedPayload,
  GenerateVerificationLinkPayload,
  LoggedInPayload,
  LoggedOutPayload,
  RefreshTokenPayload,
  RegistrationCompletedPayload,
  ResetPasswordRequestPayload,
} from "../auth.types";
import { notificationsQueue } from "@/feature/notifications/jobs/notifications.queue";
import { NotificationJobs } from "@/feature/notifications/notifications.config";
import { createNotificationPayload } from "@/feature/notifications/notifications.utils";
import { AuthNotificationTemplateMap } from "../auth.notifications";

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

    const template = createNotificationPayload(
      AuthNotificationTemplateMap.LOGIN_ALERT,
      {
        loginTime: new Date().toISOString(),
      },
    );

    await notificationsQueue.add(NotificationJobs.TriggerNotification, {
      recipientId: data.userId,
      ...template,
      correlationId: authEvent.data?.id!,
      actorId: data.userId,
      domain: "auth",
    });

    return { success: true };
  }

  static async handleRegistration(data: RegistrationCompletedPayload) {
    logger.info({ userId: data.userId }, "Processing welcome notification");
    // ... logic
    return { welcomeSent: true };
  }

  static async handleTokenRefresh(data: RefreshTokenPayload) {
    logger.info({ userId: data.userId }, "Processing welcome notification");
    // ... logic
    return { welcomeSent: true };
  }

  static async handleLogout(data: LoggedOutPayload) {
    logger.info({ userId: data.userId }, "Processing welcome notification");
    // ... logic
    return { welcomeSent: true };
  }

  static async handleResetPasswordRequest(data: ResetPasswordRequestPayload) {
    logger.info({ userId: data.userId }, "Processing welcome notification");
    // ... logic
    return { welcomeSent: true };
  }

  static async handleEmailVerified(data: EmailVerifiedPayload) {
    logger.info({ userId: data.userId }, "Processing welcome notification");
    // ... logic
    return { welcomeSent: true };
  }

  static async generateVerificationLinkEvent(
    data: GenerateVerificationLinkPayload,
  ) {
    logger.info({ userId: data.userId }, "Processing welcome notification");
    // ... logic
    return { welcomeSent: true };
  }
}
