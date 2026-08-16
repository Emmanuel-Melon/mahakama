import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersSchema } from "@/feature/users/users.schema";
import { chatsSchema } from "../chats/chats.schema";
import { SenderType } from "../chats/shared.types";

// Define sender type enum for messages
const senderTypeEnum = pgEnum(
  "sender_type",
  Object.values(SenderType) as [string, ...string[]],
);

// Chat Messages Table
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatsSchema.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  senderType: senderTypeEnum("sender_type").notNull().default("user"),
  userId: uuid("user_id").references(() => usersSchema.id, {
    onDelete: "cascade",
  }),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
  metadata: jsonb("metadata")
    .notNull()
    .default({})
    .$type<Record<string, unknown>>(),
});

export const combinedMessagesSchema = {
  chatMessages,
};
