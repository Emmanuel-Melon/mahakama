import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { usersSchema } from "@/feature/users/users.schema";

export const authEventsSchema = pgTable(
  "auth_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => usersSchema.id)
      .notNull(),
    eventType: varchar("event_type", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userEventTimeIdx: index("auth_events_user_event_time_idx").on(
      table.userId,
      table.eventType,
      table.createdAt,
    ),
  }),
);

export const sessionsSchema = pgTable("sessions", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => usersSchema.id, { onDelete: "cascade" })
    .notNull(),
  isRevoked: boolean("is_revoked").default(false).notNull(),
  refreshTokenHash: varchar("refresh_token_hash", { length: 255 }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const allowedEmails = pgTable("allowed_emails", {
  email: text("email").primaryKey(),
  addedBy: text("added_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const combinedAuthSchema = {
  authEventsSchema,
  sessionsSchema,
  allowedEmails,
};
