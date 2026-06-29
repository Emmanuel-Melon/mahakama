import { db } from "@/lib/drizzle";
import { chatMessages } from "../messages.schema";
import { ChatMessage, MessageInput } from "../messages.types";
import { eq } from "drizzle-orm";
import { getChatById } from "@/feature/chats/operations/chats.find";
import { SenderType } from "@/feature/chats/shared.types";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export const sendMessage = async (
  input: MessageInput,
): Promise<DbResult<ChatMessage>> => {
  const { chatId, content, senderType, userId } = input;
  const timestamp = new Date();

  const chat = await getChatById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  // Only validate user exists for human messages
  if (senderType === SenderType.USER && userId) {
    const { usersSchema } = await import("@/feature/users/users.schema");
    const [user] = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.id, userId))
      .limit(1);

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
  }

  const [message] = await db
    .insert(chatMessages)
    .values({
      chatId,
      content,
      senderType,
      userId,
      timestamp,
    })
    .returning();

  return toResult(message);
};
