import { findUserByEmail } from "@/feature/users/operations/users.find";
import { comparePasswords } from "../auth.utils";
import type { User } from "@/feature/users/users.types";

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const result = await findUserByEmail(email);
  if (!result.ok || !result.data.password) {
    throw new Error("Invalid email or password");
  }

  const user = result.data;
  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return user;
}
