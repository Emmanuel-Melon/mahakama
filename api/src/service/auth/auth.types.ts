import { z } from "zod";
import { AuthJobs } from "./auth.config";
import { authEventsSchema } from "./auth.schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { usersSchema } from "@/feature/users/users.schema";
import { NotificationTrackingSchema } from "@/service/notifications/notifications.types";

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const authUserSchema = createSelectSchema(usersSchema);

// Create auth schemas directly from the base schema
export const loginRequestSchema = authUserSchema
  .pick({
    email: true,
    password: true,
  })
  .openapi({
    title: "LoginRequest",
    description: "Request schema for user login",
  });

export const registerRequestSchema = authUserSchema
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

export const authEventSelectSchema = createSelectSchema(
  authEventsSchema,
).openapi({
  title: "AuthEvent",
  description: "Auth event response schema",
});

export const authEventInsertSchema = createInsertSchema(
  authEventsSchema,
).openapi({
  title: "NewAuthEvent",
  description: "Request schema for creating auth events",
});

// ============================================================================
// DOMAIN TYPES
// ============================================================================

export type LoginAttrs = z.infer<typeof loginRequestSchema>;
export type AuthResponseData = z.infer<typeof loginRequestSchema>;
export type RegisterUserAttrs = z.infer<typeof registerRequestSchema>;
export type LoginUserAttrs = z.infer<typeof loginRequestSchema>;
export type AuthEvent = z.infer<typeof authEventSelectSchema>;
export type NewAuthEvent = z.infer<typeof authEventInsertSchema>;
export type UserWithoutPassword = Omit<
  z.infer<typeof authUserSchema>,
  "password"
>;

// ============================================================================
// JOB TYPES
// ============================================================================

export interface AuthJobMap {
  [AuthJobs.Login]: {
    userId: string;
    device: string;
    loginTime: string;
  };
  [AuthJobs.Registration]: { userId: string; email: string };
}

/*
 * NOTIFICATION-RELATED TYPES (for notification system integration)
 */

export const LoginAlertNotificationSchema = NotificationTrackingSchema.extend({
  loginTime: z.string(),
  location: z.string().optional(),
  device: z.string().optional(),
});
