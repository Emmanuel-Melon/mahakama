import { createUseNavLinks } from "@mah/client/nav";
import { useUser } from "~/context/user-provider";
import { ALL_NAV_LINKS } from "./nav.config";
import type { components } from "@mah/api/generated/api.types";

type User = components["schemas"]["User"];

export const NAV_PERMISSIONS: Record<string, string[]> = {
  "nav-home": ["admin", "partner", "user"],
  "nav-matters": ["admin", "partner", "user"],
  "nav-team": ["admin", "partner"],
  "nav-notifications": ["admin", "partner", "user"],
  "nav-settings": ["admin"],
  "nav-billing": ["admin"],
};

const rolePermissions: Record<string, string[]> = {
  admin: ["admin", "user", "partner"],
  partner: ["partner"],
  user: ["user"],
};

const getUserPermissions = (user: User | null): string[] =>
  user ? rolePermissions[user.role] || [] : [];

const useCurrentUser = () => useUser().user;

export const useNavLinks = createUseNavLinks(
  ALL_NAV_LINKS,
  NAV_PERMISSIONS,
  useCurrentUser,
  getUserPermissions,
);
