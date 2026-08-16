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
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const deleteChat = async <K extends ChatColumnKey>(
  field: K,
  value: ChatColumn[K]["_"]["data"],
  options?: DeleteChatOptions,
): Promise<DbResult<ChatSession>> => {
  const conditions = [eq(chatsSchema[field], value)];

  if (options?.userId) {
    conditions.push(eq(chatsSchema.userId, options.userId));
  }

  return executeSingle(
    db
      .delete(chatsSchema)
      .where(and(...conditions))
      .returning()
      .then(([result]) => result),
  );
};

export const updateChat = async <K extends ChatColumnKey>(
  field: K,
  value: ChatColumn[K]["_"]["data"],
  data: UpdateChat,
): Promise<DbResult<ChatSession>> => {
  return executeSingle(
    db
      .update(chatsSchema)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(chatsSchema[field], value))
      .returning()
      .then(([result]) => result),
  );
};
