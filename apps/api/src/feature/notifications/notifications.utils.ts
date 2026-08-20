import { logger } from "@/lib/logger";

import { channelQueueMap } from "./jobs/notifications.queue";
import {
  NotificationChannel,
  NotificationDomain,
} from "./notifications.config";
import {
  ChannelNotificationPayload,
  type AppAction,
  type EmailAction,
  type NotificationAction,
  type NotificationPreferences,
  type PushAction,
  type TargetChannelsResult,
} from "./notifications.types";

/**
 * Derives allowable notification target delivery channels based on user opt-ins
 */
export const getTargetChannels = (
  preferences: NotificationPreferences,
  domain?: NotificationDomain,
): TargetChannelsResult => {
  const channels: NotificationChannel[] = [];

  if (preferences.inAppEnabled) channels.push(NotificationChannel.InApp);
  if (preferences.emailEnabled) channels.push(NotificationChannel.Email);
  if (preferences.pushEnabled) channels.push(NotificationChannel.Push);

  return {
    channels,
    count: channels.length,
    shouldProceed: channels.length > 0,
    hasEmail: preferences.emailEnabled ?? false,
    hasInApp: preferences.inAppEnabled ?? false,
    hasPush: preferences.pushEnabled ?? false,
  };
};

/**
 * Enqueues a prepared payload down a specific delivery channel infrastructure queue
 */
export const routeToNotificationChannel = async (
  channel: NotificationChannel,
  data: ChannelNotificationPayload,
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

/**
 * Evaluates execution results of settling channel pipeline promises to record downstream blockages
 */
export const logChannelFailures = (
  results: PromiseSettledResult<void>[],
  channels: NotificationChannel[],
  context: { recipientId?: string; templateKey: string },
): void => {
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      logger.error(
        {
          error: result.reason,
          channel: channels[index],
          recipientId: context.recipientId,
          templateKey: context.templateKey,
        },
        "Failed to route notification to channel",
      );
    }
  });
};

export const ActionTransformer = {
  toAppAction: (action: NotificationAction): AppAction => {
    const { secondary, ...rest } = action;
    return rest;
  },
  toEmailAction: (action: NotificationAction): EmailAction => {
    return {
      label: action.label,
      url: action.url,
      secondary: action.type === "secondary" || !!action.secondary,
    };
  },
  toPushAction: (action: NotificationAction): PushAction => {
    return {
      label: action.label,
      url: action.url,
    };
  },
};
