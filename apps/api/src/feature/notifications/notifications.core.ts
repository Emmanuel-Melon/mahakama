import { z } from "zod";

import { logger } from "@/lib/logger";

import {
  channelQueueMap,
  notificationsQueue,
} from "./jobs/notifications.queue";
import {
  NotificationChannel,
  NotificationDomain,
  NotificationJobs,
} from "./notifications.config";
import {
  BaseNotificationContent,
  ChannelNotificationPayload,
  NotificationTemplateDescriptor,
  type NotificationDispatchContext,
  type NotificationPreferences,
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
 * Identity binder to match structured event contexts with safe type shapes
 */
export const buildNotificationTrigger = <
  TEntry extends NotificationTemplateDescriptor,
>(
  entry: TEntry,
  data: z.infer<TEntry["schema"]>,
) => ({
  templateKey: entry.key,
  templateData: data,
});

/**
 * Dynamic dispatcher builder that enqueues structured data payloads down processing infrastructure lines
 */
export function createNotificationDispatcher<
  TMap extends Record<string, { key: string; schema: any }>,
>(domain: NotificationDomain, templateMap: TMap) {
  return async <E extends keyof TMap>(
    event: E,
    data: Parameters<typeof buildNotificationTrigger<TMap[E]>>[1],
    context: Omit<NotificationDispatchContext, "domain">,
  ) => {
    const template = buildNotificationTrigger(templateMap[event], data);

    await notificationsQueue.add(NotificationJobs.TriggerNotification, {
      ...template,
      ...context,
      domain,
    });
  };
}

/**
 * Creates a type‑safe notification generator map for a given notification map.
 *
 * A notification map defines each template's string key and Zod schema.
 * This factory ensures that the provided generator map matches the structure
 * of the notification map (keys and data types), returning the generators
 * unchanged but with full type inference.
 *
 * @param notificationMap - The notification map object (used only for type inference).
 * @returns A function that accepts a generator map (keyed by the same keys as the notification map)
 *          and returns it, preserving the types.
 *
 * @example
 * const AuthNotificationMap = {
 *   LOGIN_ALERT: {
 *     key: "auth_login_alert",
 *     schema: LoginAlertSchema,
 *   },
 * } as const;
 *
 * export const authNotificationGenerator = createNotificationGenerators(AuthNotificationMap)({
 *   LOGIN_ALERT: (data) => ({
 *     title: "Login Alert",
 *     message: `New login from ${data.location}`,
 *   }),
 * });
 */
export function createNotificationGenerators<
  TNotificationMap extends Record<string, NotificationTemplateDescriptor>,
>(_notificationMap: TNotificationMap) {
  return <
    TGeneratorMap extends {
      [K in keyof TNotificationMap]: (
        data: z.infer<TNotificationMap[K]["schema"]>,
      ) => BaseNotificationContent | Promise<BaseNotificationContent>;
    },
  >(
    notificationGenerators: TGeneratorMap,
  ): TGeneratorMap => notificationGenerators;
}
