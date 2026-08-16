import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatMessages } from "./messages.schema";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { SenderType } from "@/feature/chats/shared.types";
import { MessageJobs } from "./messages.config";
import { crudMeta } from "@/lib/openapi/openapi.utils";

extendZodWithOpenApi(z);

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

const baseInsert = createInsertSchema(chatMessages);
const baseSelect = createSelectSchema(chatMessages);

// Schema for API responses
export const chatSelectSchema = crudMeta(baseSelect, "select", "ChatMessage");

export const chatInsertSchema = crudMeta(
  baseInsert.omit({ id: true, timestamp: true }),
  "insert",
  "ChatMessage",
);

export const messageInputSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string().min(1),
  senderType: z.enum([
    SenderType.USER,
    SenderType.ASSISTANT,
    SenderType.SYSTEM,
  ]),
  userId: z.string().uuid().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/*
 * DOMAIN-RELATED TYPES
 */

export type MessageInput = z.infer<typeof messageInputSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect & {
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  } | null;
};
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type ChatMessageResponse = z.infer<typeof chatSelectSchema>;

/*
 * DATABASE QUERY TYPES
 */
export type ChatMessageColumn = typeof chatMessages._.columns;
export type ChatMessageColumnKey = keyof ChatMessageColumn;

/*
 * QUEUE-RELATED TYPES
 */
export const MessageSentPayloadSchema = z.object({
  messageId: z.string(),
  userId: z.string(),
});

export type MessageSentPayload = z.infer<typeof MessageSentPayloadSchema>;

export interface MessageJobMap {
  [MessageJobs.MessageSent]: MessageSentPayload;
}
