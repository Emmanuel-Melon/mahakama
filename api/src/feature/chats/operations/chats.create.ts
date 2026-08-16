import { db } from "@/lib/drizzle";
import { chatsSchema } from "../chats.schema";
import type { NewChatSession, ChatSession } from "../chats.types";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export const createChat = async (
  params: NewChatSession,
): Promise<DbResult<ChatSession>> => {
  const [newChat] = await db
    .insert(chatsSchema)
    .values({
      userId: params.userId,
      title: params.title || "New Chat",
      metadata: params.metadata || {},
    })
    .returning();
  return toResult(newChat);
};
