import { db } from "@/lib/drizzle";
import { usersSchema } from "../users.schema";
import type {
  NewUser,
  UpdateUser,
  User,
  UserColumn,
  UserColumnKey,
} from "../users.types";
import { eq } from "drizzle-orm";
import { toSingleResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export const updateUser = async <K extends UserColumnKey>(
  field: K,
  value: UserColumn[K]["_"]["data"],
  updateData: UpdateUser,
): Promise<DbResult<User>> => {
  const user = await db
    .update(usersSchema)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(usersSchema[field], value))
    .returning()
    .then(([result]) => result);

  return toSingleResult(user);
};
