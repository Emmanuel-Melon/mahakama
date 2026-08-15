import { db } from "@/lib/drizzle";
import { chatMessages } from "../messages.schema";
import { ChatMessage } from "../messages.types";
import { eq } from "drizzle-orm";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export const getMessageById = async (
  messageId: string,
): Promise<DbResult<ChatMessage>> => {
  const [message] = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.id, messageId))
    .limit(1);
  return toResult(message);
};
