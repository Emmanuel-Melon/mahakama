import { Request, Response, type CookieOptions } from "express";
import { z } from "zod";
import { AuthJobs } from "./auth.config";
import { authEventsSchema, sessionsSchema } from "./auth.schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { usersSchema } from "@/feature/users/users.schema";
import { NotificationTrackingSchema } from "@/feature/notifications/notifications.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";
import { baseQuerySchema } from "@/lib/express/express.types";

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

export const sessionSelectSchema = createSelectSchema(sessionsSchema);

export const sessionInsertSchema = createInsertSchema(sessionsSchema);

export const sessionUpdateSchema = sessionInsertSchema
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const insertAuthEventInputSchema = z.object({
  userId: z.string(),
  eventType: z.string(),
  createdAt: z.date(),
});

export const insertSessionInputSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  refreshToken: z.string(),
});

export const newPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  token: z.string(),
});

export const verifyEmailBodySchema = z.object({
  token: z.string(),
});

export const signupUserSchema = createInsertSchema(usersSchema)
  .pick({
    name: true,
    email: true,
  })
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "partner", "admin"]).optional(),
  })
  .openapi({
    title: "RegisterUser",
  });

export const loginUserSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["user", "partner", "admin"]).optional(),
  })
  .openapi({
    title: "LoginUser",
  });

export const resetPasswordSchema = z.object({
  message: z.string(),
  deliveryEstimate: z.number(), // Shorter name
});

export const emailVerificationStatusSchema = z.object({
  message: z.string().openapi({
    description: "A human-readable status message.",
  }),
});

export const refreshTokenSelectSchema = z.object({
  token: z.string().jwt().describe("The new access token (JWT)"),
});

export const UserRoleSchema = z.enum(["admin", "user", "partner"]);

export const BaseTokenPayloadSchema = z.object({
  sub: z.string(),
  sid: z.string(),
  aud: z.string(),
  iss: z.string(),
});

export const AccessPayloadSchema = BaseTokenPayloadSchema.extend({
  type: z.literal("access"),
  role: UserRoleSchema,
});

export const RefreshPayloadSchema = BaseTokenPayloadSchema.extend({
  type: z.literal("refresh"),
});

export const AuthPayloadSchema = z.discriminatedUnion("type", [
  AccessPayloadSchema,
  RefreshPayloadSchema,
]);

export const TokenGenerationArgsSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  role: UserRoleSchema,
});

export const authEventQuerySchema = baseQuerySchema.extend({
  eventType: z.string().optional(),
  userId: z.string().optional(),
});

/*
 * DOMAIN-RELATED TYPES
 */
export type NewAuthUser = z.infer<typeof signupUserSchema>;
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
export type Session = z.infer<typeof sessionSelectSchema>;
export type NewSession = z.infer<typeof sessionInsertSchema>;
export type UpdateSession = z.infer<typeof sessionUpdateSchema>;
export type InsertAuthEventInput = z.infer<typeof insertAuthEventInputSchema>;
export type InsertSessionInput = z.infer<typeof insertSessionInputSchema>;
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
export type EmailVerificationStatus = z.infer<
  typeof emailVerificationStatusSchema
>;
export type RefreshToken = z.infer<typeof refreshTokenSelectSchema>;
export type BaseTokenPayload = z.infer<typeof BaseTokenPayloadSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type AccessPayload = z.infer<typeof AccessPayloadSchema>;
export type RefreshPayload = z.infer<typeof RefreshPayloadSchema>;
export type AuthPayload = z.infer<typeof AuthPayloadSchema>;
export type TokenGenerationArgs = z.infer<typeof TokenGenerationArgsSchema>;
export interface AuthTokensArgs {
  req: Request;
  res: Response;
  userId: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
}
export interface GetCookieOptionsArgs extends Omit<CookieOptions, "sameSite"> {
  maxAgeInMs?: number;
  sameSite?: "none" | "lax" | "strict";
}

/*
 * DATABASE QUERY TYPES
 */

export type AuthColumn = typeof usersSchema._.columns;
export type AuthColumnKey = keyof AuthColumn;
export type AuthEventColumn = typeof authEventsSchema._.columns;
export type AuthEventColumnKey = keyof AuthEventColumn;
export type SessionColumn = typeof sessionsSchema._.columns;
export type SessionColumnKey = keyof SessionColumn;
export type AuthEventFilters = z.infer<typeof authEventQuerySchema>;

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

type BaseAuthPayload = {
  userId: string;
};
export type RegistrationCompletedPayload = BaseAuthPayload;
export type LoggedInPayload = BaseAuthPayload;
export type RefreshTokenPayload = BaseAuthPayload;
export type LoggedOutPayload = BaseAuthPayload;
export type ResetPasswordRequestPayload = {
  email: string;
  correlationId: string;
  userId: string;
};
export type EmailVerifiedPayload = BaseAuthPayload;
export type GenerateVerificationLinkPayload = BaseAuthPayload;

export interface AuthJobMap {
  [AuthJobs.RegistrationCompleted]: RegistrationCompletedPayload;
  [AuthJobs.LoggedIn]: LoggedInPayload;
  [AuthJobs.RefreshToken]: RefreshTokenPayload;
  [AuthJobs.LoggedOut]: LoggedOutPayload;
  [AuthJobs.ResetPasswordRequest]: ResetPasswordRequestPayload;
  [AuthJobs.EmailVerified]: EmailVerifiedPayload;
  [AuthJobs.GenerateVerificationLink]: GenerateVerificationLinkPayload;
}

/*
 * NOTIFICATION-RELATED TYPES (for notification system integration)
 */

export const LoginAlertNotificationSchema = NotificationTrackingSchema.extend({
  loginTime: z.string(),
  location: z.string().optional(),
  device: z.string().optional(),
});
