import { db } from "@/lib/drizzle";
import { usersSchema, type UserRole } from "../users.schema";
import type { NewUser, User } from "../users.types";
import { eq } from "drizzle-orm";
import { findUserById } from "./users.find";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export async function updateUser(
  userId: string,
  userAttrs: NewUser,
): Promise<DbResult<User>> {
  const existingUser = await findUserById(userId);

  const [user] = await db
    .update(usersSchema)
    .set({
      ...userAttrs,
      updatedAt: new Date(),
      role: userAttrs.role as UserRole,
    })
    .where(eq(usersSchema.id, userId))
    .returning();

  return toResult(user);
}
