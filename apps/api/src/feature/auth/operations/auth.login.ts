import { findAuthUser } from "./auth.find";
import { comparePasswords } from "../auth.utils";
import { HttpStatus } from "@/lib/http/http.status";
import { HttpError } from "@/lib/http/http.error";
import type { AuthUser } from "../auth.types";

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthUser> {
  const result = await findAuthUser("email", email);
  if (!result.ok) {
    throw new HttpError(HttpStatus.NOT_FOUND, "User not found");
  }

  const user = result.data;
  if (!user.password) {
    throw new HttpError(HttpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(HttpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  return user;
}
