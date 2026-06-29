import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// Keep the constants for enum values (needed for drizzle schema)
export const Genders = {
  MALE: "male",
  FEMALE: "female",
  NON_BINARY: "non_binary",
  PREFER_NOT_TO_SAY: "prefer_not_to_say",
  OTHER: "other",
} as const;

export const UserRoles = {
  USER: "user" as const,
  ADMIN: "admin" as const,
  LAWYER: "lawyer" as const,
} as const;

// Export inferred types from schemas
export const GenderValues = Object.values(Genders) as [string, ...string[]];
export const UserRoleValues = Object.values(UserRoles) as [string, ...string[]];

export const genderSchema = z.enum(GenderValues).openapi({
  title: "Gender",
  description: "User gender options",
  example: "male",
});

export const userRoleSchema = z.enum(UserRoleValues).openapi({
  title: "UserRole",
  description: "User role in the system",
  example: "user",
});
export type UserRole = z.infer<typeof userRoleSchema>;
export type Gender = z.infer<typeof genderSchema>;

export const usersSchema = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  role: text("role", {
    enum: UserRoleValues,
  })
    .$type<UserRole>()
    .notNull()
    .default("user"),
  fingerprint: varchar("fingerprint", { length: 255 }).unique(),
  userAgent: text("user_agent"),
  lastIp: varchar("last_ip", { length: 45 }),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  age: integer("age"),
  gender: text("gender", { enum: GenderValues }).$type<Gender>(),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  occupation: varchar("occupation", { length: 100 }),
  bio: text("bio"),
  profilePicture: text("profile_picture"),
  isOnboarded: boolean("is_onboarded").default(false).notNull(),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// relations
export const combinedUsersSchema = {
  usersSchema,
};
