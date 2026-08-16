import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { chatsSchema } from "../chats.schema";
import type {
  ChatSessionWithMessages,
  ChatSession,
  ChatsFilters,
  ChatColumnKey,
  ChatColumn,
} from "../chats.types";
import { toManyResult, toResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult, DbResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findChats = async (
  userId: string,
  query: ChatsFilters,
): Promise<DbManyResult<ChatSession>> => {
  const result = await paginate<"chatsSchema", ChatSession>(
    "chatsSchema",
    chatsSchema,
    {
      ...query,
      filters: [eq(chatsSchema.userId, userId)],
      search: {
        q: query.q,
        columns: [chatsSchema.title],
      },
    },
  );
  return toManyResult(result);
};

export const findChat = async <K extends ChatColumnKey>(
  field: K,
  value: ChatColumn[K]["_"]["data"],
): Promise<DbResult<ChatSessionWithMessages>> => {
  const chat = await db.query.chatsSchema.findFirst({
    where: eq(chatsSchema[field], value),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.timestamp)],
      },
    },
  });
  return toResult(chat);
};
