import { eq } from "drizzle-orm";
import { usersSchema } from "@/feature/users/users.schema";
import { type User } from "@/feature/users/users.types";
import { db } from "@/lib/drizzle";
import type { DbResult } from "@/lib/drizzle/drizzle.types";
import { executeSingle } from "@/lib/drizzle/results/results.single";
import type { NewAuthUser } from "../auth.types";
import { hashPassword } from "../auth.utils";

export async function signupUser(
  userData: NewAuthUser,
): Promise<DbResult<User>> {
  const { email, password, name, role } = userData;
  const hashedPassword = await hashPassword(password);
  return executeSingle(
    db
      .insert(usersSchema)
      .values({
        name,
        email,
        role,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .then((result) => result[0]),
  );
}

export async function updateUserPassword(
  userId: string,
  password: string,
): Promise<DbResult<User>> {
  const hashedPassword = await hashPassword(password);

  return executeSingle(
    db
      .update(usersSchema)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(usersSchema.id, userId))
      .returning()
      .then((result) => result[0]),
  );
}
