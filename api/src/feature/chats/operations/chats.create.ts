import { db } from "@/lib/drizzle";
import { chatsSchema } from "../chats.schema";
import type { NewChatSession, ChatSession } from "../chats.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const createChat = async (
  params: NewChatSession,
): Promise<DbResult<ChatSession>> => {
  return executeSingle(
    db
      .insert(chatsSchema)
      .values({
        userId: params.userId,
        title: params.title || "New Chat",
        metadata: params.metadata || {},
      })
      .returning()
      .then(([newChat]) => newChat),
  );
};
