import { logger } from "@/lib/logger";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { createAuthEvent } from "../operations/auth.create";
import { AuthJobs } from "../auth.config";
import { AuthJobMap } from "../auth.types";
import { notificationsQueue } from "@/service/notifications/jobs/notifications.queue";
import { NotificationJobs } from "@/service/notifications/notifications.config";
import { createNotificationPayload } from "@/service/notifications/notifications.utils";
import { AuthNotificationTemplateMap } from "../auth.notifications";

export class AuthJobHandler {
  static async handleLogin(data: AuthJobMap[typeof AuthJobs.Login]) {
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

  static async handleRegistration(
    data: AuthJobMap[typeof AuthJobs.Registration],
  ) {
    logger.info({ userId: data.userId }, "Processing welcome notification");
    // ... logic
    return { welcomeSent: true };
  }
}
