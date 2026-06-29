import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatMessages } from "./messages.schema";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { SenderType } from "@/feature/chats/shared.types";
import { MessageJobs } from "./messages.config";

extendZodWithOpenApi(z);

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

// Schema for API responses
export const chatSelectSchema = createSelectSchema(chatMessages).openapi({
  title: "ChatMessage",
  description: "Chat message response schema",
});

export const chatInsertSchema = createInsertSchema(chatMessages)
  .omit({ id: true, timestamp: true })
  .openapi({
    title: "CreateChatMessageRequest",
    description: "Request schema for creating a new chat message",
  });

export const messageInputSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string().min(1),
  senderType: z.enum([
    SenderType.USER,
    SenderType.ASSISTANT,
    SenderType.SYSTEM,
  ]),
  userId: z.string().uuid().nullable(),
});

// ============================================================================
// DOMAIN TYPES
// ============================================================================

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

// ============================================================================
// JOB TYPES
// ============================================================================

export interface MessageJobMap {
  [MessageJobs.MessageSent]: {
    messageId: string;
    userId: string;
  };
}
