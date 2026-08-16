import { db } from "@/lib/drizzle";
import { chatMessages } from "../messages.schema";
import { ChatMessage } from "../messages.types";
import { eq } from "drizzle-orm";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";

export const getMessagesByChatId = async (
  chatId: string,
): Promise<DbManyResult<ChatMessage>> => {
  const messages = await db.query.chatMessages.findMany({
    where: eq(chatMessages.chatId, chatId),
    orderBy: (chatMessages, { asc }) => [asc(chatMessages.timestamp)],
  });
  return toManyResult(messages);
};
