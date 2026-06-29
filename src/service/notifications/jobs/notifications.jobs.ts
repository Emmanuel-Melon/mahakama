import { logger } from "@/lib/logger";
import { NotificationJobs } from "../notifications.config";
import { NotificationJobMap } from "../notifications.types";
import { NotificationsRegistry } from "../notifications.registry";
import { getNotificationPreferences } from "../operations/notifications.find";
import {
  getTargetChannels,
  routeToNotificationChannel,
  logChannelFailures,
} from "../notifications.utils";

export class NotificationsJobHandler {
  static async handleSetPreferences(
    data: NotificationJobMap[typeof NotificationJobs.SetPreferences],
  ) {
    // TODO: Implement set preferences logic
    logger.info({ data }, "Set preferences job received");
    return { success: true, data };
  }

  static async handleTriggerNotification(
    data: NotificationJobMap[typeof NotificationJobs.TriggerNotification],
  ) {
    const { recipientId, templateKey, correlationId } = data;
    const userPreferences = await getNotificationPreferences(recipientId);
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

    const content = await NotificationsRegistry.generateBaseNotificationContent(
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
        }),
      ),
    );

    // Log any channel failures
    logChannelFailures(results, targetChannels.channels, {
      recipientId: data.recipientId,
      templateKey: data.templateKey,
    });
    return {
      success: true,
      recipientId: data.recipientId,
      templateKey: data.templateKey,
      correlationId,
    };
  }

  static async handleSendEmailNotification(
    data: NotificationJobMap[typeof NotificationJobs.SendEmailNotification],
  ) {
    const { recipientId } = data;

    logger.info({ recipientId }, "Processing send email notification job");

    // TODO: Add email notification logic here
    // - Generate email content
    // - Send via email service
    // - Track delivery status
    // - Handle bounces and retries

    return { success: true, recipientId };
  }

  static async handleSendInAppNotification(
    data: NotificationJobMap[typeof NotificationJobs.SendInAppNotification],
  ) {
    const { recipientId } = data;

    logger.info({ recipientId }, "Processing send in-app notification job");

    // TODO: Add in-app notification logic here
    // - Store notification in user's feed
    // - Update unread counts
    // - Trigger real-time updates
    // - Archive old notifications

    return { success: true, recipientId };
  }

  static async handleSendPushNotification(
    data: NotificationJobMap[typeof NotificationJobs.SendPushNotification],
  ) {
    const { recipientId } = data;

    logger.info({ recipientId }, "Processing send push notification job");

    // TODO: Add push notification logic here
    // - Get user device tokens
    // - Format push payload
    // - Send via push service
    // - Handle device token updates

    return { success: true, recipientId };
  }
}
