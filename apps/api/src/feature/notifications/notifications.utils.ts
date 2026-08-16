import {
  ChannelNotificationJob,
  NotificationTemplateDescriptor,
} from "./notifications.types";
import { logger } from "@/lib/logger";
import type {
  NotificationPreferences,
  TargetChannelsResult,
} from "./notifications.types";
import { z } from "zod";
import { channelQueueMap } from "./jobs/notifications.queue";
import { NotificationChannel } from "./notifications.config";

export const getTargetChannels = (
  preferences: NotificationPreferences,
): TargetChannelsResult => {
  const channels: NotificationChannel[] = [];

  if (preferences.inAppEnabled) channels.push(NotificationChannel.InApp);
  if (preferences.emailEnabled) channels.push(NotificationChannel.Email);
  if (preferences.pushEnabled) channels.push(NotificationChannel.Push);

  return {
    channels,
    count: channels.length,
    shouldProceed: channels.length > 0,
    hasEmail: preferences.emailEnabled || false,
    hasInApp: preferences.inAppEnabled || false,
    hasPush: preferences.pushEnabled || false,
  };
};

export const routeToNotificationChannel = async (
  channel: NotificationChannel,
  data: ChannelNotificationJob,
): Promise<void> => {
  const enqueue = channelQueueMap[channel];

  if (!enqueue) {
    logger.warn(
      { channel },
      "Attempted to route to an unsupported notification channel",
    );
    return;
  }
  await enqueue(data);
};

export const logChannelFailures = (
  results: PromiseSettledResult<void>[],
  channels: NotificationChannel[],
  context: {
    recipientId: string;
    templateKey: string;
  },
): void => {
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const channel = channels[index];
      logger.error(
        {
          error: result.reason,
          channel,
          recipientId: context.recipientId,
          templateKey: context.templateKey,
        },
        "Failed to route notification to channel",
      );
    }
  });
};

export const createNotificationPayload = <
  TEntry extends NotificationTemplateDescriptor,
>(
  entry: TEntry,
  data: z.infer<TEntry["schema"]>,
) => ({
  templateKey: entry.key,
  templateData: data,
});
