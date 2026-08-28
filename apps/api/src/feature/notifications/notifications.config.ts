import { z } from "zod";

import { JsonApiResourceConfig } from "@/lib/express/express.types";

import type {
  Notification,
  NotificationPreferences,
  PushSubscription,
} from "./notifications.types";

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

export const SerializedPushSubscription: JsonApiResourceConfig<PushSubscription> =
  {
    type: "push-subscription",
    attributes: (pushSubscription: PushSubscription) => pushSubscription,
  };

export const NotificationJobs = {
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

export const NotificationDomain = {
  Admin: "admin",
  Auth: "auth",
  Consultations: "consultations",
  Payments: "payments",
  Plans: "plans",
  Relationships: "relationships",
  System: "system",
  Users: "users",
} as const;

export const notificationDomainSchema = z.enum(
  Object.values(NotificationDomain) as [string, ...string[]],
);

export type NotificationDomain =
  (typeof NotificationDomain)[keyof typeof NotificationDomain];
