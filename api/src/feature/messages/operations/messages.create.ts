import { db } from "@/lib/drizzle";
import { chatMessages } from "../messages.schema";
import { ChatMessage, MessageInput } from "../messages.types";
import { eq } from "drizzle-orm";
import { findChat } from "@/feature/chats/operations/chats.find";
import { SenderType } from "@/feature/chats/shared.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const sendMessage = async (
  input: MessageInput,
): Promise<DbResult<ChatMessage>> => {
  const { chatId, content, senderType, userId, metadata } = input;
  const timestamp = new Date();

  const chatResult = await findChat("id", chatId);
  if (!chatResult.ok) {
    return {
      ok: false,
      data: null,
      reason: "Chat not found",
      type: "NOT_FOUND",
    };
  }

  // Only validate user exists for human messages
  if (senderType === SenderType.USER && userId) {
    const { usersSchema } = await import("@/feature/users/users.schema");
    const userResult = await executeSingle(
      db
        .select()
        .from(usersSchema)
        .where(eq(usersSchema.id, userId))
        .limit(1)
        .then(([user]) => user),
    );

    if (!userResult.ok) {
      return {
        ok: false,
        data: null,
        reason: `User with ID ${userId} not found`,
        type: "NOT_FOUND",
      };
    }
  }

  return executeSingle(
    db
      .insert(chatMessages)
      .values({
        chatId,
        content,
        senderType,
        userId,
        timestamp,
        metadata,
      })
      .returning()
      .then(([message]) => message),
  );
};
