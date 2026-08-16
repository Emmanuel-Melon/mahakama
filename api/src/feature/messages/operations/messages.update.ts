import { db } from "@/lib/drizzle";
import { chatMessages } from "../messages.schema";
import { ChatMessage } from "../messages.types";
import { eq } from "drizzle-orm";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import { findMessage } from "./messages.find";

export const REPLY_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type ReplyStatus = (typeof REPLY_STATUS)[keyof typeof REPLY_STATUS];

export const updateMessageReplyStatus = async (
  messageId: string,
  status: ReplyStatus,
  errorMessage?: string,
): Promise<DbResult<ChatMessage>> => {
  const existing = await findMessage("id", messageId);
  if (!existing.ok || !existing.data) {
    return existing;
  }

  const metadata: Record<string, unknown> = {
    ...(existing.data.metadata || {}),
    replyStatus: status,
    ...(errorMessage ? { errorMessage } : {}),
  };

  return executeSingle(
    db
      .update(chatMessages)
      .set({ metadata })
      .where(eq(chatMessages.id, messageId))
      .returning()
      .then(([message]) => message),
  );
};
