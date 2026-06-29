import { db } from "@/lib/drizzle";
import { eq, desc } from "drizzle-orm";
import { chatsSchema } from "../chats.schema";
import { ChatSessionWithMessages, type ChatSession, ChatsFilters } from "../chats.types";
import { toManyResult, toResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult, DbResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";


export const getUserChats = async (
  userId: string,
  query: ChatsFilters,
): Promise<DbManyResult<ChatSession>> => {
  const result = await paginate<"chatsSchema", ChatSession>("chatsSchema", chatsSchema, {
    ...query,
    filters: [eq(chatsSchema.userId, userId)],
    search: {
      q: query.q,
      columns: [chatsSchema.title],
    },
  });
  return toManyResult(result);
};

export const getChatById = async (
  chatId: string,
): Promise<DbResult<ChatSessionWithMessages>> => {
  const chat = await db.query.chatsSchema.findFirst({
    where: eq(chatsSchema.id, chatId),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.timestamp)],
      },
    },
  });
  return toResult(chat);
};
