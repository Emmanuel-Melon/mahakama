import { eq } from "drizzle-orm";

import { db } from "@/lib/drizzle";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

import { usersSchema } from "../users.schema";
import type {
  UpdateUser,
  User,
  UserColumn,
  UserColumnKey,
} from "../users.types";

export const updateUser = async <K extends UserColumnKey>(
  field: K,
  value: UserColumn[K]["_"]["data"],
  updateData: UpdateUser,
): Promise<DbResult<User>> => {
  return executeSingle(
    db
      .update(usersSchema)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(usersSchema[field], value))
      .returning()
      .then(([result]) => result),
  );
};
