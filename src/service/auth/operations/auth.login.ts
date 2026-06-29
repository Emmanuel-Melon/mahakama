import { findUserByEmail } from "@/feature/users/operations/users.find";
import { comparePasswords } from "../auth.utils";
import type { User } from "@/feature/users/users.types";

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const user = await findUserByEmail(email);
  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return user;
}
