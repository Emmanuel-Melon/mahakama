import { createUseNavLinks } from "@mah/client/nav";
import { useUser } from "~/context/user-provider";
import { ALL_NAV_LINKS } from "./nav.config";
import type { User } from "@mah/api/src/clients/auth.api";

export const NAV_PERMISSIONS: Record<string, string[]> = {
  "nav-orders": ["admin"],
  "nav-partners": ["admin"],
  "nav-vouchers": ["partner"],
  "nav-occasions": ["user", "partner"],
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
