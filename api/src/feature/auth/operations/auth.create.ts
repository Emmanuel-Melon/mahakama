import { db } from "@/lib/drizzle";
import { usersSchema } from "@/feature/users/users.schema";
import { type User } from "@/feature/users/users.types";
import { authEventsSchema } from "../auth.schema";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import type { RegisterUserAttrs, AuthEvent, NewAuthEvent } from "../auth.types";

export async function createAuthEvent(
  data: NewAuthEvent,
): Promise<DbResult<AuthEvent>> {
  return executeSingle(
    db
      .insert(authEventsSchema)
      .values(data)
      .returning()
      .then(([authEvent]) => authEvent),
  );
}

export async function registerUser(
  userData: RegisterUserAttrs & { password: string },
): Promise<DbResult<User>> {
  const { email, password, name } = userData;
  return executeSingle(
    db
      .insert(usersSchema)
      .values({
        name,
        email,
        password,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .then(([newUser]) => newUser),
  );
}
