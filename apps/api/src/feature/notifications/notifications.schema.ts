import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { usersSchema } from "../users/users.schema";

// Notification type enum
export const notificationTypeEnum = pgEnum("notification_type", [
  "admin",
  "auth",
  "consultations",
  "payments",
  "plans",
  "system",
  "users",
]);

// Notification channel enum
export const notificationChannelEnum = pgEnum("notification_channel", [
  "in_app",
  "email",
  "push",
]);

// Recipient type enum
export const recipientTypeEnum = pgEnum("recipient_type", [
  "sender",
  "fulfillment_partner",
  "admin",
]);

// Notification status enum
export const notificationStatusEnum = pgEnum("notification_status", [
  "notification_pending",
  "notification_sent",
  "notification_delivered",
  "notification_opened",
  "notification_failed",
]);

// Notification failure reason enum
export const notificationFailureReasonEnum = pgEnum(
  "notification_failure_reason",
  ["provider_error", "invalid_target", "rejected", "blocked"],
);

export const notificationsSchema = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Nullable now: identity-less recipients (invitations, pre-signup flows)
    // have no user row to attach to.
    userId: uuid("user_id").references(() => usersSchema.id, {
      onDelete: "cascade",
    }),

    // Fallback addressing for identity-less recipients. Not a FK — just the
    // raw address a delivery attempt was made to.
    recipientEmail: varchar("recipient_email", { length: 255 }),

    type: varchar("type", { length: 100 }).notNull(),
    channel: notificationChannelEnum("channel").notNull().default("in_app"),
    recipientType: recipientTypeEnum("recipient_type")
      .notNull()
      .default("sender"),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    actionUrl: text("action_url"),
    scheduledAt: timestamp("scheduled_at").notNull(),
    sentAt: timestamp("sent_at"),
    deliveredAt: timestamp("delivered_at"),
    status: notificationStatusEnum("status")
      .notNull()
      .default("notification_pending"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    templateKey: varchar("template_key", { length: 100 }),
    entityId: varchar("entity_id", { length: 255 }),
    isRead: boolean("is_read").default(false).notNull(),
    readAt: timestamp("read_at"),
    isActioned: boolean("is_actioned").default(false).notNull(),
    actionedAt: timestamp("actioned_at"),
  },
  (table) => ({
    recipientPresentCheck: check(
      "notifications_recipient_present_check",
      sql`${table.userId} IS NOT NULL OR ${table.recipientEmail} IS NOT NULL`,
    ),
  }),
);

export const pushSubscriptionsSchema = pgTable("push_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull().unique(),
  keys: jsonb("keys").$type<{ p256dh: string; auth: string }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userNotificationPreferences = pgTable(
  "user_notification_preferences",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => usersSchema.id),
    category: varchar("category"),
    emailEnabled: boolean("email_enabled").default(true),
    pushEnabled: boolean("push_enabled").default(true),
    inAppEnabled: boolean("in_app_enabled").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
);

// Relations
export const notificationsRelations = relations(
  notificationsSchema,
  ({ one }) => ({
    user: one(usersSchema, {
      fields: [notificationsSchema.userId],
      references: [usersSchema.id],
    }),
  }),
);

export const combinedNotificationsSchema = {
  notificationsSchema,
  userNotificationPreferences,
  notificationsRelations,
  pushSubscriptionsSchema,
};
