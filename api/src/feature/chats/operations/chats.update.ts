import { db } from "@/lib/drizzle";
import { chatsSchema } from "../chats.schema";
import { and, eq } from "drizzle-orm";
import {
  ChatColumn,
  ChatColumnKey,
  DeleteChatOptions,
  UpdateChat,
  type ChatSession,
} from "../chats.types";
import { toSingleResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export const deleteChat = async <K extends ChatColumnKey>(
  field: K,
  value: ChatColumn[K]["_"]["data"],
  options?: DeleteChatOptions,
): Promise<DbResult<ChatSession>> => {
  const conditions = [eq(chatsSchema[field], value)];

  if (options?.userId) {
    conditions.push(eq(chatsSchema.userId, options.userId));
  }

  const deletedChat = await db
    .delete(chatsSchema)
    .where(and(...conditions))
    .returning()
    .then(([result]) => result);

  return toSingleResult(deletedChat);
};

export const updateChat = async <K extends ChatColumnKey>(
  field: K,
  value: ChatColumn[K]["_"]["data"],
  data: UpdateChat,
): Promise<DbResult<ChatSession>> => {
  const updatedChat = await db
    .update(chatsSchema)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(chatsSchema[field], value))
    .returning()
    .then(([result]) => result);

  return toSingleResult(updatedChat);
};
