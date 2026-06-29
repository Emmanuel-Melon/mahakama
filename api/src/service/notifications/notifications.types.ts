import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "./notifications.schema";
import { NotificationChannel, NotificationJobs } from "./notifications.config";
import { JobOptions } from "@/lib/bullmq/bullmq.types";
extendZodWithOpenApi(z);

/**
 * ZOD Schemas
 */
export const notificationInsertSchema = createInsertSchema(
  notificationsSchema,
).openapi({
  title: "CreateUnotification",
  description: "Request schema for creating a new notification",
});

export const notificationSelectSchema = createSelectSchema(
  notificationsSchema,
).openapi({
  title: "Notification",
  description: "Response schema for notifications",
});

export const notificationPreferencesInsertSchema = createInsertSchema(
  userNotificationPreferences,
).openapi({
  title: "Notification Preferences",
  description: "Request schema for adding notification preferences",
});

export const notificationPreferencesSelectSchema = createSelectSchema(
  userNotificationPreferences,
).openapi({
  title: "Notification Preferences",
  description: "Response schema for notification preferences",
});

export const NotificationTrackingSchema = z.object({
  actorId: z.string().optional(),
  subjectIds: z.array(z.string()).optional(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  occurredAt: z.string().optional(),
});
/*
 * DOMAIN-SPECIFIC TYPES (core business types)
 */
export type Notification = z.infer<typeof notificationSelectSchema>;
export type NewNotification = z.infer<typeof notificationInsertSchema>;
export type NotificationPreferences = z.infer<
  typeof notificationPreferencesSelectSchema
>;
export type NewNotificationPreferences = z.infer<
  typeof notificationPreferencesInsertSchema
>;

export type NotificationDomain =
  | "auth"
  | "relationship"
  | "occasion"
  | "decision"
  | "gifting"
  | "system";

/*
 * NOTIFICATION CONTENT TYPES
 */
export type NotificationAction = {
  label: string;
  url: string;
  type: "primary" | "secondary" | "danger";
  method?: "GET" | "POST";
};

export type BaseNotificationContent = {
  title: string;
  message: string;
  action?: NotificationAction;
  metadata?: Record<string, any>;
};

export type BaseNotificationContentGenerator<T = any> = (
  data: T,
) => BaseNotificationContent | Promise<BaseNotificationContent>;

/*
 * JOB-RELATED TYPES
 */

// Central trigger queue job
export interface TriggerNotificationJob {
  correlationId: string;
  createdAt?: string;
  actorId: string;
  recipientId: string;
  domain: NotificationDomain;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
  templateKey: string;
  templateData: Record<string, any>;
}

// Single unified channel job — email adds `email`, push/in-app don't need it
export interface ChannelNotificationJob {
  recipientId: string;
  correlationId: string;
  content: BaseNotificationContent;
  metadata?: Record<string, any>;
  email?: string; // only required for email channel; validate at send time
}

// Map of job names to their payloads
export interface NotificationJobMap {
  [NotificationJobs.SetPreferences]: {
    userId: string;
    preferences: NotificationPreferences;
  };
  [NotificationJobs.TriggerNotification]: TriggerNotificationJob;
  [NotificationJobs.SendEmailNotification]: ChannelNotificationJob;
  [NotificationJobs.SendInAppNotification]: ChannelNotificationJob;
  [NotificationJobs.SendPushNotification]: ChannelNotificationJob;
}

/*
 * QUEUE-RELATED TYPES
 */
export type TriggerQueueJob = Pick<
  NotificationJobMap,
  typeof NotificationJobs.TriggerNotification
>;
export type EmailQueueJob = Pick<
  NotificationJobMap,
  typeof NotificationJobs.SendEmailNotification
>;
export type InAppQueueJob = Pick<
  NotificationJobMap,
  typeof NotificationJobs.SendInAppNotification
>;
export type PushQueueJob = Pick<
  NotificationJobMap,
  typeof NotificationJobs.SendPushNotification
>;

export type NotificationChannelRouter = (
  data: ChannelNotificationJob,
) => Promise<unknown>;

/*
 * TEMPLATE-RELATED TYPES
 */

// Unified descriptor (was duplicated as NotificationMap + NotificationTemplateDescriptor)
export type NotificationTemplateDescriptor<
  T extends z.ZodSchema = z.ZodSchema,
> = {
  key: string;
  schema: T;
};

export type InferTemplateData<T> =
  T extends NotificationTemplateDescriptor<infer S> ? z.infer<S> : never;

export type RegistryEntry = {
  schema: z.ZodSchema;
  generator: BaseNotificationContentGenerator;
};

/*
 * UTILITY TYPES
 */
export interface TargetChannelsResult {
  channels: NotificationChannel[];
  count: number;
  shouldProceed: boolean;
  hasEmail: boolean;
  hasInApp: boolean;
  hasPush: boolean;
}

export type NotificationDomainEntry = {
  map: Record<string, NotificationTemplateDescriptor>;
  generators: Record<string, BaseNotificationContentGenerator>;
};
