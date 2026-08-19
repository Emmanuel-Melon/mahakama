import type { DbResult } from "@/lib/drizzle/drizzle.types";
import { executeSingle } from "@/lib/drizzle/results/results.single";

import type { AuthUser, LoginAttrs } from "../auth.types";
import { findAuthUser } from "./auth.find";
import { comparePasswords } from "../auth.utils";

export async function loginUser({
  email,
  password,
}: LoginAttrs): Promise<DbResult<AuthUser | null>> {
  return executeSingle(
    (async () => {
      const userResult = await findAuthUser("email", email!);
      if (!userResult.ok) {
        return null;
      }

      const user = userResult.data;
      if (!user.password) {
        return null;
      }

      const isPasswordValid = await comparePasswords(password!, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return user;
    })(),
  );
}
