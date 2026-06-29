import { db } from "@/lib/drizzle";
import { eq, desc, sql, inArray } from "drizzle-orm";
import { chatMessages } from "@/feature/messages/messages.schema";
import { chatsSchema } from "../chats.schema";
import {
  ChatListEntry,
  ListChatsParams,
  type ChatSession,
} from "../chats.types";

export async function listUserChats({
  userId,
  limit = 20,
  offset = 0,
}: ListChatsParams): Promise<ChatListEntry[]> {
  // Get chats with their message counts
  const chats = await db
    .select({
      id: chatsSchema.id,
      title: chatsSchema.title,
      metadata: chatsSchema.metadata,
      createdAt: chatsSchema.createdAt,
      updatedAt: chatsSchema.updatedAt,
      messageCount: sql<number>`count(${chatMessages.id})`,
    })
    .from(chatsSchema)
    .leftJoin(chatMessages, eq(chatMessages.chatId, chatsSchema.id))
    .where(eq(chatsSchema.userId, userId))
    .groupBy(
      chatsSchema.id,
      chatsSchema.title,
      chatsSchema.metadata,
      chatsSchema.createdAt,
      chatsSchema.updatedAt,
    )
    .orderBy(desc(chatsSchema.updatedAt))
    .limit(limit)
    .offset(offset);

  // Get the last message for each chat
  const chatIds = chats.map((chat) => chat.id);
  const lastMessages =
    chatIds.length > 0
      ? await db
          .select({
            chatId: chatMessages.chatId,
            content: chatMessages.content,
            timestamp: chatMessages.timestamp,
          })
          .from(chatMessages)
          .where(inArray(chatMessages.chatId, chatIds))
          .groupBy(
            chatMessages.chatId,
            chatMessages.content,
            chatMessages.timestamp,
          )
          .having(
            sql`${chatMessages.timestamp} = MAX(${chatMessages.timestamp})`,
          )
          .then(
            (messages) =>
              new Map(
                messages.map((msg) => [
                  msg.chatId,
                  {
                    content: msg.content,
                    timestamp: msg.timestamp,
                  },
                ]),
              ),
          )
      : new Map();

  // Combine the data
  return chats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    metadata: chat.metadata || {},
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    lastMessage: lastMessages.get(chat.id),
    messageCount: Number(chat.messageCount) || 0,
  }));
}
