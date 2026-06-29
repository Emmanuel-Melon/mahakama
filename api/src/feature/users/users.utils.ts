import { UserRole } from "./users.schema";

export const getRandomRole = (index: number): UserRole => {
  if (index < 2) return "admin" as UserRole;
  if (index < 5) return "lawyer" as UserRole;
  return "user" as UserRole;
};
