import { db } from "@/lib/drizzle";
import { chatMessages } from "../messages.schema";
import {
  ChatMessage,
  ChatMessageColumn,
  ChatMessageColumnKey,
} from "../messages.types";
import { eq } from "drizzle-orm";
import { toSingleResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export const findMessage = async <K extends ChatMessageColumnKey>(
  field: K,
  value: ChatMessageColumn[K]["_"]["data"],
): Promise<DbResult<ChatMessage>> => {
  const message = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages[field], value))
    .limit(1)
    .then(([result]) => result);

  return toSingleResult(message);
};
