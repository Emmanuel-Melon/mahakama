import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatsSchema } from "./chats.schema";
import { chatMessages } from "@/feature/messages/messages.schema";
import { ChatsJobs } from "./chats.config";
import { baseQuerySchema } from "@/lib/express/express.types";

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const chatSelectSchema = createSelectSchema(chatsSchema);
export const chatInsertSchema = createInsertSchema(chatsSchema);

// ============================================================================
// DOMAIN TYPES
// ============================================================================

export type ChatSession = z.infer<typeof chatSelectSchema>;
export type NewChatSession = z.infer<typeof chatInsertSchema>;
export type ChatSessionWithMessages = ChatSession & {
  messages: (typeof chatMessages.$inferSelect)[];
};

export type ChatSessionAttrs = z.infer<typeof chatsSchema>;
export type ChatSessionResponse = z.infer<typeof chatSelectSchema>;

// ============================================================================
// JOB TYPES
// ============================================================================

export interface ChatsJobMap {
  [ChatsJobs.ChatCreated]: {
    userId: string;
    chatId: string;
  };
  [ChatsJobs.MessageSent]: {
    userId: string;
    messageId: string;
  };
}

// ============================================================================
// API PARAMETER TYPES
// ============================================================================

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

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface ChatListEntry extends Omit<ChatSession, "userId"> {
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  messageCount: number;
}

export type ChatsFilters = z.infer<typeof baseQuerySchema>;