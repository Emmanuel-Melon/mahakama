import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "./notifications.schema";
import { NotificationChannel, NotificationJobs } from "./notifications.config";
import { JobOptions } from "@/lib/bullmq/bullmq.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";
extendZodWithOpenApi(z);

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

const baseNotificationInsert = createInsertSchema(notificationsSchema);
const baseNotificationSelect = createSelectSchema(notificationsSchema);

export const notificationInsertSchema = crudMeta(
  baseNotificationInsert,
  "insert",
  "Unotification",
);

export const notificationSelectSchema = crudMeta(
  baseNotificationSelect,
  "select",
  "Notification",
);

const basePreferencesInsert = createInsertSchema(userNotificationPreferences);
const basePreferencesSelect = createSelectSchema(userNotificationPreferences);

export const notificationPreferencesInsertSchema = crudMeta(
  basePreferencesInsert,
  "insert",
  "NotificationPreferences",
);

export const notificationPreferencesSelectSchema = crudMeta(
  basePreferencesSelect,
  "select",
  "NotificationPreferences",
);

export const NotificationTrackingSchema = z.object({
  actorId: z.string().optional(),
  subjectIds: z.array(z.string()).optional(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  occurredAt: z.string().optional(),
});

/*
 * DOMAIN-RELATED TYPES
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
  "auth" | "relationship" | "occasion" | "decision" | "gifting" | "system";

/*
 * DATABASE QUERY TYPES
 */
export type NotificationColumn = typeof notificationsSchema._.columns;
export type NotificationColumnKey = keyof NotificationColumn;

export type UserNotificationPreferencesColumn =
  typeof userNotificationPreferences._.columns;
export type UserNotificationPreferencesColumnKey =
  keyof UserNotificationPreferencesColumn;

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
 * QUEUE-RELATED TYPES
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

export const SetPreferencesPayloadSchema = z.object({
  userId: z.string(),
  preferences: notificationPreferencesSelectSchema,
});

export const TriggerNotificationPayloadSchema =
  z.custom<TriggerNotificationJob>();
export const ChannelNotificationPayloadSchema =
  z.custom<ChannelNotificationJob>();

export type SetPreferencesPayload = z.infer<typeof SetPreferencesPayloadSchema>;
export type TriggerNotificationPayload = TriggerNotificationJob;
export type ChannelNotificationPayload = ChannelNotificationJob;

// Map of job names to their payloads
export interface NotificationJobMap {
  [NotificationJobs.SetPreferences]: SetPreferencesPayload;
  [NotificationJobs.TriggerNotification]: TriggerNotificationJob;
  [NotificationJobs.SendEmailNotification]: ChannelNotificationJob;
  [NotificationJobs.SendInAppNotification]: ChannelNotificationJob;
  [NotificationJobs.SendPushNotification]: ChannelNotificationJob;
}

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
