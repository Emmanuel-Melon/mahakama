import { db } from "@/lib/drizzle";
import { chatsSchema } from "../chats.schema";
import { and, eq } from "drizzle-orm";
import { UpdateChatParams, type ChatSession } from "../chats.types";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export async function updateChat({
  id,
  userId,
  title,
  metadata,
}: UpdateChatParams): Promise<DbResult<ChatSession>> {
  const [updatedChat] = await db
    .update(chatsSchema)
    .set({
      title: title ?? undefined,
      metadata: metadata ?? undefined,
      updatedAt: new Date(),
    })
    .where(and(eq(chatsSchema.id, id), eq(chatsSchema.userId, userId)))
    .returning();

  return toResult(updatedChat);
}

export async function deleteChat(
  chatId: string,
  userId: string,
): Promise<DbResult<ChatSession>> {
  const [deletedChat] = await db
    .delete(chatsSchema)
    .where(and(eq(chatsSchema.id, chatId), eq(chatsSchema.userId, userId)))
    .returning();

  return toResult(deletedChat);
}
