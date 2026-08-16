import { eq } from "drizzle-orm";

import { db } from "@/lib/drizzle";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

import { usersSchema } from "../users.schema";

export async function deleteUser(
  userId: string,
): Promise<DbResult<{ id: string }>> {
  return executeSingle(
    db
      .delete(usersSchema)
      .where(eq(usersSchema.id, userId))
      .returning({ id: usersSchema.id })
      .then(([deleted]) => deleted),
  );
}
