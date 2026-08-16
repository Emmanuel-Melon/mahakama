import { logger } from "@/lib/logger";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { createAuthEvent } from "../operations/auth.create";
import { AuthJobs } from "../auth.config";
import { LoginPayload, RegistrationPayload } from "../auth.types";
import { notificationsQueue } from "@/feature/notifications/jobs/notifications.queue";
import { NotificationJobs } from "@/feature/notifications/notifications.config";
import { createNotificationPayload } from "@/feature/notifications/notifications.utils";
import { AuthNotificationTemplateMap } from "../auth.notifications";

export class AuthJobHandler {
  static async handleLogin(data: LoginPayload) {
    const authEvent = unwrapJobResult(
      await createAuthEvent({
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

  static async handleRegistration(data: RegistrationPayload) {
    logger.info({ userId: data.userId }, "Processing welcome notification");
    // ... logic
    return { welcomeSent: true };
  }
}
