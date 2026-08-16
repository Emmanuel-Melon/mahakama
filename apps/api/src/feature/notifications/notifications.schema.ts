import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  varchar,
  pgEnum,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersSchema } from "@/feature/users/users.schema";

export const notificationChannelEnum = pgEnum("notification_channel", [
  "in_app",
  "email",
  "push",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "pending",
  "sent",
  "delivered",
  "failed",
  "read",
]);

export const notificationsSchema = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  // Logical grouping (auth, gifting, system)
  type: varchar("type", { length: 50 }).notNull(),
  channel: notificationChannelEnum("channel").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: notificationStatusEnum("status").notNull().default("pending"),
  templateKey: varchar("template_key", { length: 100 }),
  correlationId: uuid("correlation_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  scheduledAt: timestamp("scheduled_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userNotificationPreferences = pgTable(
  "user_notification_preferences",
  {
    userId: uuid("user_id").primaryKey(),
    emailEnabled: boolean("email_enabled").default(true).notNull(),
    pushEnabled: boolean("push_enabled").default(true).notNull(),
    inAppEnabled: boolean("in_app_enabled").default(true).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
);

export const combinedNotificationsSchema = {
  notificationsSchema,
  userNotificationPreferences,
};
