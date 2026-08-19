import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dbConfig } from "@/config";
import { combinedChatsSchema } from "@/feature/chats/chats.schema";
import { combinedCorpusSchema } from "@/feature/corpus/corpus.schema";
import { combinedMessagesSchema } from "@/feature/messages/messages.schema";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import { combinedNotificationsSchema } from "@/feature/notifications/notifications.schema";
import { combinedLawyersSchema } from "@/feature/lawyers/lawyers.schema";
import { combinedUsersSchema } from "@/feature/users/users.schema";
import { combinedAuthSchema } from "@/feature/auth/auth.schema";
import { combinedServiceSchema } from "@/feature/services/services.schema";
import { combinedInferenceSchema } from "@/feature/inference/inference.schema";
import { allRelations } from "./drizzle.relations";

const pool = new Pool({
  connectionString: dbConfig.postgres.url,
});

export const db = drizzle(pool, {
  schema: {
    ...combinedAuthSchema,
    ...combinedChatsSchema,
    ...combinedCorpusSchema,
    ...combinedMessagesSchema,
    ...lawyersTable,
    ...combinedNotificationsSchema,
    ...combinedUsersSchema,
    ...combinedLawyersSchema,
    ...combinedServiceSchema,
    ...combinedInferenceSchema,
    ...allRelations,
  },
  logger: process.env.NODE_ENV !== "production",
});

export type Database = typeof db;

export const closeDb = async () => {
  await pool.end();
};
