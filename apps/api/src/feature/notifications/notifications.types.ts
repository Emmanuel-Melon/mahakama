import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  notificationsSchema,
  pushSubscriptionsSchema,
  userNotificationPreferences,
} from "./notifications.schema";
import {
  NotificationChannel,
  notificationDomainSchema,
  NotificationJobs,
} from "./notifications.config";
import { JobOptions } from "@/lib/bullmq/bullmq.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";
import { baseQuerySchema } from "@/lib/express/express.types";
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

export const pushSubscriptionInsertSchema = createInsertSchema(
  pushSubscriptionsSchema,
).openapi({
  title: "Push Subscription",
  description: "Request schema for adding push subscription",
});

export const pushSubscriptionSelectSchema = createSelectSchema(
  pushSubscriptionsSchema,
).openapi({
  title: "Push Subscription",
  description: "Response schema for push subscription",
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
export type PushSubscription = z.infer<typeof pushSubscriptionSelectSchema>;
export type NewPushSubscription = z.infer<typeof pushSubscriptionInsertSchema>;
export type UpdateNotification = Partial<
  Omit<NewNotification, "id" | "userId" | "createdAt">
>;
export type UpdateNotificationPreferences = Partial<
  Omit<NewNotificationPreferences, "id" | "userId" | "createdAt">
>;

/*
 * DATABASE QUERY TYPES
 */
export type NotificationColumn = typeof notificationsSchema._.columns;
export type NotificationColumnKey = keyof NotificationColumn;
export type PreferencesColumn = typeof userNotificationPreferences._.columns;
export type PreferencesColumnKey = keyof PreferencesColumn;

/*
 * NOTIFICATION CONTENT TYPES
 */
export const baseTrackingSchema = z.object({
  actorId: z.string().optional(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
});

export const baseDispatchSchema = z.object({
  correlationId: z.string(),
  recipientId: z.string().optional(),
  email: z.string().email().optional(),
});

export const notificationActionSchema = z.object({
  label: z.string(),
  url: z.string(),
  type: z.enum(["primary", "secondary", "danger"]).default("primary"),
  method: z.enum(["GET", "POST"]).optional(),
  secondary: z.boolean().optional(),
});

export const baseNotificationContentSchema = z.object({
  title: z.string(),
  message: z.string(),
  action: notificationActionSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const emailNotificationContentSchema =
  baseNotificationContentSchema.extend({
    emailHtml: z.string(),
  });

export const channelContentSchema = z.object({
  [NotificationChannel.Email]: emailNotificationContentSchema,
  [NotificationChannel.InApp]: baseNotificationContentSchema,
  [NotificationChannel.Push]: baseNotificationContentSchema,
});

export const baseEmailLayoutPropsSchema = z.object({
  title: z.string(),
  preheader: z.string().optional(),
  contentHtml: z.string(),
  action: z
    .object({
      label: z.string(),
      url: z.string(),
      type: z.enum(["primary", "secondary"]).optional(),
    })
    .optional(),
});

export type NotificationAction = z.infer<typeof notificationActionSchema>;
export type EmailAction = Pick<NotificationAction, "label" | "url"> & {
  secondary: boolean;
};
export type AppAction = Omit<NotificationAction, "secondary">;
export type PushAction = Pick<NotificationAction, "label" | "url">;
export type BaseNotificationContent = z.infer<
  typeof baseNotificationContentSchema
>;
export type EmailNotificationContent = z.infer<
  typeof emailNotificationContentSchema
>;
export type ChannelContent = z.infer<typeof channelContentSchema>;
export type BaseEmailLayoutProps = z.infer<typeof baseEmailLayoutPropsSchema>;

export type BaseNotificationContentGenerator<T = unknown> = (
  data: T,
) => BaseNotificationContent | Promise<BaseNotificationContent>;

export type NotificationDomainEntry = {
  map: Record<string, NotificationTemplateDescriptor>;
  generators: Record<string, BaseNotificationContentGenerator<any>>;
};

/*
 * QUEUE-RELATED TYPES
 */
export const triggerNotificationPayloadSchema = baseDispatchSchema
  .merge(baseTrackingSchema)
  .extend({
    createdAt: z.string().datetime().optional(),
    domain: notificationDomainSchema,
    metadata: z.record(z.string(), z.unknown()).optional(),
    templateKey: z.string(),
    templateData: z.record(z.string(), z.unknown()),
  });

export const channelNotificationPayloadSchema = z.object({
  correlationId: z.string(),
  recipientId: z.string().optional(),
  email: z.string().email().optional(),
  entityId: z.string().optional(), // From baseTrackingSchema
  templateKey: z.string(),
  content: baseNotificationContentSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type TriggerNotificationPayload = z.infer<
  typeof triggerNotificationPayloadSchema
>;
export type ChannelNotificationPayload = z.infer<
  typeof channelNotificationPayloadSchema
>;

export interface NotificationJobMap {
  [NotificationJobs.TriggerNotification]: TriggerNotificationPayload;
  [NotificationJobs.SendEmailNotification]: ChannelNotificationPayload;
  [NotificationJobs.SendInAppNotification]: ChannelNotificationPayload;
  [NotificationJobs.SendPushNotification]: ChannelNotificationPayload;
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
export type ChannelQueueJob = Omit<
  NotificationJobMap,
  typeof NotificationJobs.TriggerNotification
>;

export type NotificationChannelRouter = (
  data: ChannelNotificationPayload,
) => Promise<unknown>;

/*
 * TEMPLATE-RELATED TYPES
 */
export const notificationTemplateDescriptorSchema = z.object({
  key: z.string(),
  schema: z.instanceof(z.ZodType),
});

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
export const targetChannelsResultSchema = z.object({
  channels: z.array(z.nativeEnum(NotificationChannel)),
  count: z.number().int().nonnegative(),
  shouldProceed: z.boolean(),
  hasEmail: z.boolean(),
  hasInApp: z.boolean(),
  hasPush: z.boolean(),
});

export type TargetChannelsResult = z.infer<typeof targetChannelsResultSchema>;

/*
 * DISPATCH CONTEXT
 */
export const notificationDispatchContextSchema = baseDispatchSchema.extend({
  domain: notificationDomainSchema,
});

export const NotificationTrackingSchema = baseTrackingSchema.extend({
  subjectIds: z.array(z.string()).optional(),
  occurredAt: z.string().optional(),
});

export type NotificationDispatchContext = z.infer<
  typeof notificationDispatchContextSchema
>;

export interface NotificationChannelHandler {
  send: (payload: ChannelNotificationPayload) => Promise<void>;
}
