import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatsSchema } from "./chats.schema";
import { chatMessages } from "@/feature/messages/messages.schema";
import { ChatsJobs } from "./chats.config";
import { baseQuerySchema } from "@/lib/express/express.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

const baseInsert = createInsertSchema(chatsSchema);
const baseSelect = createSelectSchema(chatsSchema);

export const chatSelectSchema = crudMeta(baseSelect, "select", "ChatSession");

export const chatInsertSchema = crudMeta(baseInsert, "insert", "ChatSession");

export const chatsQuerySchema = baseQuerySchema.extend({
  userId: z.string().optional(),
});

/*
 * DOMAIN-RELATED TYPES
 */

export type ChatSession = z.infer<typeof chatSelectSchema>;
export type NewChatSession = z.infer<typeof chatInsertSchema>;
export type ChatSessionWithMessages = ChatSession & {
  messages: (typeof chatMessages.$inferSelect)[];
};

export type ChatSessionAttrs = z.infer<typeof chatsSchema>;
export type ChatSessionResponse = z.infer<typeof chatSelectSchema>;
export type ChatsFilters = z.infer<typeof chatsQuerySchema>;

/*
 * DATABASE QUERY TYPES
 */
export type ChatColumn = typeof chatsSchema._.columns;
export type ChatColumnKey = keyof ChatColumn;

/*
 * QUEUE-RELATED TYPES
 */
export const ChatCreatedPayloadSchema = z.object({
  userId: z.string(),
  chatId: z.string(),
});

export const MessageSentPayloadSchema = z.object({
  userId: z.string(),
  messageId: z.string(),
});

export type ChatCreatedPayload = z.infer<typeof ChatCreatedPayloadSchema>;
export type MessageSentPayload = z.infer<typeof MessageSentPayloadSchema>;

export interface ChatsJobMap {
  [ChatsJobs.ChatCreated]: ChatCreatedPayload;
  [ChatsJobs.MessageSent]: MessageSentPayload;
}

/*
 * API PARAMETER TYPES
 */

export interface CreateChatParams {
  userId: string;
  title?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ListChatsParams {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface UpdateChatParams {
  id: string;
  userId: string;
  title?: string | null;
  metadata?: Record<string, unknown> | null;
}

/*
 * RESPONSE TYPES
 */

export interface ChatListEntry extends Omit<ChatSession, "userId"> {
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  messageCount: number;
}
