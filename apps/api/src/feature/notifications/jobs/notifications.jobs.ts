import { logger } from "@/lib/logger";
import { NotificationChannel } from "../notifications.config";
import {
  TriggerNotificationPayload,
  ChannelNotificationPayload,
} from "../notifications.types";
import { findNotificationPreferences } from "../operations/notifications.find";
import {
  getTargetChannels,
  routeToNotificationChannel,
  logChannelFailures,
} from "../notifications.utils";
import { NotificationsDomainRegistry } from "../notifications.registry";
import { NotificationChannelRegistry } from "../notifications.channels";

export class NotificationsJobHandler {
  static async handleTriggerNotification(data: TriggerNotificationPayload) {
    const { recipientId, templateKey, correlationId } = data;
    const userPreferences = await findNotificationPreferences(
      recipientId || "",
    );
    if (!userPreferences.ok) {
      logger.error(
        { recipientId, templateKey, correlationId },
        "Failed to get user notification preferences",
      );
      return { success: false, recipientId, templateKey, correlationId };
    }
    const targetChannels = getTargetChannels(userPreferences.data);
    // Check if user has any enabled notification channels
    if (!targetChannels.shouldProceed) {
      logger.info(
        {
          recipientId,
          templateKey,
          correlationId,
          channelCount: targetChannels.count,
          hasEmail: targetChannels.hasEmail,
          hasInApp: targetChannels.hasInApp,
          hasPush: targetChannels.hasPush,
        },
        "Notification skipped - no enabled channels found for user",
      );
      return;
    }

    const content =
      await NotificationsDomainRegistry.generateBaseNotificationContent(
        data.templateKey,
        data.templateData,
      );

    // Route to channel-specific queues in parallel
    const results = await Promise.allSettled(
      targetChannels.channels.map((channel) =>
        routeToNotificationChannel(channel, {
          recipientId: data.recipientId,
          correlationId: correlationId,
          content,
          templateKey: data.templateKey,
        }),
      ),
    );

    // Log any channel failures
    logChannelFailures(results, targetChannels.channels, {
      recipientId: data?.recipientId,
      templateKey: data.templateKey,
    });
    return {
      success: true,
      recipientId: data.recipientId,
      templateKey: data.templateKey,
      correlationId,
    };
  }

  static async handleSendEmailNotification(data: ChannelNotificationPayload) {
    const { recipientId } = data;

    logger.info({ recipientId }, "Processing send email notification job");

    const handler = NotificationChannelRegistry[NotificationChannel.Email];
    if (!handler) {
      logger.error("Email channel handler not registered");
      return { success: false, recipientId };
    }

    await handler.send(data);
    return { success: true, recipientId };
  }

  static async handleSendInAppNotification(data: ChannelNotificationPayload) {
    const { recipientId } = data;

    logger.info({ recipientId }, "Processing send in-app notification job");

    const handler = NotificationChannelRegistry[NotificationChannel.InApp];
    if (!handler) {
      logger.error("In-app channel handler not registered");
      return { success: false, recipientId };
    }

    await handler.send(data);
    return { success: true, recipientId };
  }

  static async handleSendPushNotification(data: ChannelNotificationPayload) {
    const { recipientId } = data;

    logger.info({ recipientId }, "Processing send push notification job");

    const handler = NotificationChannelRegistry[NotificationChannel.Push];
    if (!handler) {
      logger.error("Push channel handler not registered");
      return { success: false, recipientId };
    }

    await handler.send(data);
    return { success: true, recipientId };
  }
}
