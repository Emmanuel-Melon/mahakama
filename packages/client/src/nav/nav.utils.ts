import type { UserRole } from "@mah/api/src/clients/auth.api";
import { createPath } from "./nav.paths";

export const ONBOARDING_PATH = "/onboarding";
export const LAWYER_ONBOARDING_PATH = "/onboarding/lawyer";

export const getOnboardingPath = (role?: string | null): string =>
  role === "lawyer" ? LAWYER_ONBOARDING_PATH : ONBOARDING_PATH;

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
