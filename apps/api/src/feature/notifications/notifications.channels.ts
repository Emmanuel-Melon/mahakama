import { servicesConfig } from "@/config";
import { logger } from "@/lib/logger";

import { NotificationChannel } from "./notifications.config";
import type {
  ChannelNotificationPayload,
  EmailNotificationContent,
  NotificationChannelHandler,
} from "./notifications.types";
import { createNotification } from "./operations/notifications.insert";

export const emailChannelHandler: NotificationChannelHandler = {
  send: async (payload) => {
    const emailContent = payload.content as EmailNotificationContent;

    const newNotification = await createNotification({
      userId: payload.recipientId ?? null,
      recipientEmail: payload.recipientId ? null : (payload.email ?? null),
      title: emailContent.title ?? "",
      message: emailContent.message ?? "",
      channel: NotificationChannel.Email,
      status: "notification_pending",
      type: "system",
      scheduledAt: new Date(),
      actionUrl: null,
      templateKey: payload.templateKey,
      entityId: payload.entityId ?? null,
    });

    const emailHtml = emailContent.emailHtml;
    const fallbackText = emailHtml
      ? undefined
      : [emailContent.title, emailContent.message].filter(Boolean).join("\n\n");

    // send email via email service

    logger.info(
      {
        notificationId: newNotification.data?.id,
        recipient: payload.recipientId ?? payload.email,
      },
      "Email notification sent",
    );
  },
};

export const inAppChannelHandler: NotificationChannelHandler = {
  send: async (payload) => {
    if (!payload.recipientId) {
      logger.warn(
        {
          templateKey: payload.templateKey,
          correlationId: payload.correlationId,
        },
        "In-app notification requires a recipientId — skipping identity-less payload",
      );
      return;
    }

    const newNotification = await createNotification({
      userId: payload.recipientId,
      recipientEmail: null,
      title: payload.content.title ?? "",
      message: payload.content.message ?? "",
      channel: NotificationChannel.InApp,
      status: "notification_pending",
      type: "system",
      scheduledAt: new Date(),
      actionUrl: payload.content.action?.url ?? null,
      templateKey: payload.templateKey,
      entityId: payload.entityId ?? null,
    });

    logger.info(
      {
        notificationId: newNotification?.data?.id,
        userId: payload.recipientId,
      },
      "Sending in-app notification",
    );
  },
};

export const pushChannelHandler: NotificationChannelHandler = {
  send: async (payload) => {
    if (!payload.recipientId) {
      logger.warn(
        {
          templateKey: payload.templateKey,
          correlationId: payload.correlationId,
        },
        "Push notification requires a recipientId — skipping identity-less payload",
      );
      return;
    }

    const newNotification = await createNotification({
      userId: payload.recipientId,
      recipientEmail: null,
      title: payload.content.title ?? "",
      message: payload.content.message ?? "",
      channel: NotificationChannel.Push,
      status: "notification_pending",
      type: "system",
      scheduledAt: new Date(),
      actionUrl: null,
      templateKey: payload.templateKey,
      entityId: payload.entityId ?? null,
    });

    logger.info(
      { notificationId: newNotification.data?.id, userId: payload.recipientId },
      "Sending push notification",
    );
  },
};

export const NotificationChannelRegistry: Partial<
  Record<NotificationChannel, NotificationChannelHandler>
> = {
  [NotificationChannel.Email]: emailChannelHandler,
  [NotificationChannel.InApp]: inAppChannelHandler,
  [NotificationChannel.Push]: pushChannelHandler,
};
