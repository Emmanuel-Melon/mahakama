import { db } from "@/lib/drizzle";
import { usersSchema } from "@/feature/users/users.schema";
import { type User } from "@/feature/users/users.types";
import { authEventsSchema } from "../auth.schema";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";
import type { RegisterUserAttrs, AuthEvent } from "../auth.types";

export async function createAuthEvent(data: {
  userId: string;
  eventType: string;
  createdAt: Date;
}): Promise<DbResult<AuthEvent>> {
  const [authEvent] = await db
    .insert(authEventsSchema)
    .values({
      userId: data.userId,
      eventType: data.eventType,
      createdAt: data.createdAt,
    })
    .returning();
  return toResult(authEvent);
}

export async function registerUser(
  userData: RegisterUserAttrs & { password: string },
): Promise<DbResult<User>> {
  const { email, password, name } = userData;
  const [newUser] = await db
    .insert(usersSchema)
    .values({
      name,
      email,
      password,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return toResult(newUser);
}
