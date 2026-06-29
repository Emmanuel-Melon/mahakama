import { JsonApiResourceConfig } from "@/lib/express/express.types";
import type {
  Notification,
  NotificationDomainEntry,
  NotificationPreferences,
} from "./notifications.types";
import {
  AuthNotificationTemplateMap,
  authNotificationGenerators,
} from "@/service/auth/auth.notifications";
import {
  UserNotificationTemplateMap,
  usersNotificationGenerators,
} from "@/feature/users/users.notifications";

export const SerializedNotification: JsonApiResourceConfig<Notification> = {
  type: "notification",
  attributes: (notification: Notification) => notification,
};

export const SerializedNotificationPreferences: JsonApiResourceConfig<NotificationPreferences> =
  {
    type: "notification-preferences",
    attributes: (notificationPreferences: NotificationPreferences) =>
      notificationPreferences,
  };

export const NotificationJobs = {
  SetPreferences: "set-preferences",
  TriggerNotification: "trigger-notification",
  SendEmailNotification: "send-email-notification",
  SendInAppNotification: "send-in-app-notification",
  SendPushNotification: "send-push-notification",
} as const;

export type NotificationJobType =
  (typeof NotificationJobs)[keyof typeof NotificationJobs];

export enum NotificationChannel {
  Email = "email",
  Push = "push",
  InApp = "in_app",
}

// ─── Domain registration
export const NOTIFICATION_DOMAINS: NotificationDomainEntry[] = [
  { map: AuthNotificationTemplateMap, generators: authNotificationGenerators },
  {
    map: UserNotificationTemplateMap,
    generators: usersNotificationGenerators,
  },
];
