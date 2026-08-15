import { findAuthUser } from "./auth.find";
import { comparePasswords } from "../auth.utils";
import type { User } from "@/feature/users/users.types";

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const result = await findAuthUser("email", email);
  if (!result.ok) {
    throw new Error("Invalid email or password");
  }

  const user = result.data;
  if (!user.password) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return user;
}
