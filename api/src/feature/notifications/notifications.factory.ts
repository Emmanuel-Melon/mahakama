import type {
  BaseNotificationContent,
  NotificationTemplateDescriptor,
} from "./notifications.types";
import { z } from "zod";

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
      ) => BaseNotificationContent;
    },
  >(
    notificationGenerators: TGeneratorMap,
  ): TGeneratorMap => notificationGenerators;
}
