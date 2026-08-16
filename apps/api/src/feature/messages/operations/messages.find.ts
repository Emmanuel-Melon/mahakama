import { db } from "@/lib/drizzle";
import { chatMessages } from "../messages.schema";
import {
  ChatMessage,
  ChatMessageColumn,
  ChatMessageColumnKey,
} from "../messages.types";
import { eq } from "drizzle-orm";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const findMessage = async <K extends ChatMessageColumnKey>(
  field: K,
  value: ChatMessageColumn[K]["_"]["data"],
): Promise<DbResult<ChatMessage>> => {
  return executeSingle(
    db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages[field], value))
      .limit(1)
      .then(([result]) => result),
  );
};
