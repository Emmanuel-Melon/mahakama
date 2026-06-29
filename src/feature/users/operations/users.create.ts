import { db } from "@/lib/drizzle";
import { usersSchema } from "../users.schema";
import { User, NewUser } from "../users.types";
import { v4 as uuid } from "uuid";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export async function createUser(userData: NewUser): Promise<DbResult<User>> {
  const [user] = await db
    .insert(usersSchema)
    .values({
      id: uuid(),
      name: userData.name ?? null,
      email: userData.email ?? null,
      password: userData.password ?? null,
    })
    .returning();

  return toResult(user);
}
