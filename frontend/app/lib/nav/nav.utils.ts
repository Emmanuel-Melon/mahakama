import type { UserRole } from "@ivyi/client/src/auth/auth.types";
import { createPath } from "./nav.paths";

export const getAuthToggleUrl = (mode: "login" | "signup", role?: UserRole) => {
  const isPartner = role === "partner";
  if (mode === "login") {
    return isPartner ? "/partners/auth/signup" : "/signup";
  }
  return isPartner ? "/partners/auth/login" : "/login";
};

export const withParam = (route: string, param: string) => (value: string) =>
  createPath(route, { [param]: value });

export const withRoute = (param: string) => (route: string) =>
  withParam(route, param);
