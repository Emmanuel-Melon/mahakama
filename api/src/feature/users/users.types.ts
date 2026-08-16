import { z } from "zod";
import { usersSchema } from "./users.schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { chatsSchema } from "@/feature/chats/chats.schema";
import { UserJobs } from "./users.config";
import { baseQuerySchema } from "@/lib/express/express.types";
import { NotificationTrackingSchema } from "@/service/notifications/notifications.types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { generateDrizzleCrudSchemas } from "@/lib/drizzle/drizzle.utils";
import { crudMeta } from "@/lib/openapi/openapi.utils";

extendZodWithOpenApi(z);

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

const baseInsert = createInsertSchema(usersSchema);
const baseSelect = createSelectSchema(usersSchema);

export const usersInsertSchema = crudMeta(
  baseInsert.omit({ id: true, role: true, createdAt: true }),
  "insert",
  "User",
);

export const usersSelectSchema = crudMeta(
  baseSelect.omit({ password: true, fingerprint: true }),
  "select",
  "User",
);

export const usersUpdateSchema = crudMeta(
  baseInsert.omit({ id: true, createdAt: true, password: true }).partial(),
  "update",
  "User",
);

export const userQuerySchema = baseQuerySchema.extend({
  role: z.string().optional(),
});

/*
 * DOMAIN-RELATED TYPES
 */

export type User = z.infer<typeof usersSelectSchema>;
export type NewUser = z.infer<typeof usersInsertSchema>;
export type UpdateUser = z.infer<typeof usersUpdateSchema>;
export type UserWithChats = User & {
  chats: (typeof chatsSchema.$inferSelect)[];
};
export type UserFilters = z.infer<typeof userQuerySchema>;
export type GetUsersParams = {
  id?: string;
};

/*
 * DATABASE QUERY TYPES
 */
export type UserColumn = typeof usersSchema._.columns;
export type UserColumnKey = keyof UserColumn;

/*
 * QUEUE-RELATED TYPES
 */
export const BaseUserPayloadSchema = z.object({
  userId: z.string(),
});

export const UserVerifiedPayloadSchema = BaseUserPayloadSchema.extend({
  verifiedAt: z.string(),
});

export type BaseUserPayload = z.infer<typeof BaseUserPayloadSchema>;
export type UserVerifiedPayload = z.infer<typeof UserVerifiedPayloadSchema>;

export interface UserJobMap {
  [UserJobs.UserCreated]: BaseUserPayload;
  [UserJobs.UserUpdated]: BaseUserPayload;
  [UserJobs.UserDeleted]: BaseUserPayload;
  [UserJobs.UserOnboarded]: BaseUserPayload;
  [UserJobs.UserVerified]: UserVerifiedPayload;
}

/*
 * NOTIFICATION-RELATED TYPES (for notification system integration)
 */

export const UserCreatedNotificationSchema = NotificationTrackingSchema.extend({
  userId: z.string(),
  userName: z.string().optional(),
  email: z.string().optional(),
  registrationMethod: z.string().optional(),
});
