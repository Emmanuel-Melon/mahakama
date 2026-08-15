import { z } from "zod";
import { AuthJobs } from "./auth.config";
import { authEventsSchema } from "./auth.schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { usersSchema } from "@/feature/users/users.schema";
import { NotificationTrackingSchema } from "@/service/notifications/notifications.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

const baseUserSelect = createSelectSchema(usersSchema);

export const authUserSelectSchema = crudMeta(
  baseUserSelect,
  "select",
  "AuthUser",
);

// Create auth schemas directly from the base schema
export const loginRequestSchema = authUserSelectSchema
  .pick({
    email: true,
    password: true,
  })
  .openapi({
    title: "LoginRequest",
    description: "Request schema for user login",
  });

export const registerRequestSchema = authUserSelectSchema
  .pick({
    email: true,
    password: true,
    name: true,
  })
  .openapi({
    title: "RegisterRequest",
    description: "Request schema for user registration",
  });

export const authHeadersSchema = z
  .object({
    authorization: z
      .string()
      .min(1, { message: "Authorization header is required" }),
  })
  .openapi({
    title: "AuthHeaders",
    description: "Request headers for authentication",
  });

const baseAuthEventSelect = createSelectSchema(authEventsSchema);
const baseAuthEventInsert = createInsertSchema(authEventsSchema);

export const authEventSelectSchema = crudMeta(
  baseAuthEventSelect,
  "select",
  "AuthEvent",
);

export const authEventInsertSchema = crudMeta(
  baseAuthEventInsert,
  "insert",
  "AuthEvent",
);

/*
 * DOMAIN-RELATED TYPES
 */

export type AuthUser = z.infer<typeof authUserSelectSchema>;
export type LoginAttrs = z.infer<typeof loginRequestSchema>;
export type AuthResponseData = z.infer<typeof loginRequestSchema>;
export type RegisterUserAttrs = z.infer<typeof registerRequestSchema>;
export type LoginUserAttrs = z.infer<typeof loginRequestSchema>;
export type AuthEvent = z.infer<typeof authEventSelectSchema>;
export type NewAuthEvent = z.infer<typeof authEventInsertSchema>;
export type UserWithoutPassword = Omit<
  z.infer<typeof authUserSelectSchema>,
  "password"
>;

/*
 * DATABASE QUERY TYPES
 */

export type AuthColumn = typeof usersSchema._.columns;
export type AuthColumnKey = keyof AuthColumn;

/*
 * QUEUE-RELATED TYPES
 */

export const LoginPayloadSchema = z.object({
  userId: z.string(),
  device: z.string(),
  loginTime: z.string(),
});

export const RegistrationPayloadSchema = z.object({
  userId: z.string(),
  email: z.string(),
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type RegistrationPayload = z.infer<typeof RegistrationPayloadSchema>;

export interface AuthJobMap {
  [AuthJobs.Login]: LoginPayload;
  [AuthJobs.Registration]: RegistrationPayload;
}

/*
 * NOTIFICATION-RELATED TYPES (for notification system integration)
 */

export const LoginAlertNotificationSchema = NotificationTrackingSchema.extend({
  loginTime: z.string(),
  location: z.string().optional(),
  device: z.string().optional(),
});
