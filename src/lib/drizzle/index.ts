import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dbConfig } from "@/config";
import { combinedChatsSchema } from "@/feature/chats/chats.schema";
import { combinedDocumentsSchema } from "@/feature/documents/documents.schema";
import { combinedMessagesSchema } from "@/feature/messages/messages.schema";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import { combinedNotificationsSchema } from "@/service/notifications/notifications.schema";
import { combinedLawyersSchema } from "@/feature/lawyers/lawyers.schema";
import { combinedUsersSchema } from "@/feature/users/users.schema";
import { combinedAuthSchema } from "@/service/auth/auth.schema";
import { combinedServiceSchema } from "@/feature/services/services.schema";
import { allRelations } from "./drizzle.relations";

const pool = new Pool({
  connectionString: dbConfig.postgres.url,
});

export const db = drizzle(pool, {
  schema: {
    ...combinedAuthSchema,
    ...combinedChatsSchema,
    ...combinedDocumentsSchema,
    ...combinedMessagesSchema,
    ...lawyersTable,
    ...combinedNotificationsSchema,
    ...combinedUsersSchema,
    ...combinedLawyersSchema,
    ...combinedServiceSchema,
    ...allRelations,
  },
  logger: process.env.NODE_ENV !== "production",
});

export type Database = typeof db;

export const closeDb = async () => {
  await pool.end();
};
