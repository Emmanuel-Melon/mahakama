import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersSchema } from "@/feature/users/users.schema";

export const authEventsSchema = pgTable("auth_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => usersSchema.id)
    .notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const combinedAuthSchema = {
  authEventsSchema,
};
