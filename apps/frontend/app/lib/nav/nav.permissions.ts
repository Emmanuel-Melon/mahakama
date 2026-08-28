import type { User } from "@mah/api/src/clients/auth.api";
import { useUser } from "~/context/user-provider";
import { ALL_NAV_LINKS } from "./nav.config";

export const NAV_PERMISSIONS: Record<string, string[]> = {
  "nav-orders": ["admin"],
  "nav-partners": ["admin"],
  "nav-vouchers": ["partner"],
  "nav-occasions": ["user", "partner"],
};

export const getUserPermissions = (user: User | null): string[] => {
  if (!user) return [];

  const rolePermissions: Record<string, string[]> = {
    admin: ["admin", "user", "partner"],
    partner: ["partner"],
    user: ["user"],
  };

  return rolePermissions[user.role] || [];
};

export const useNavLinks = () => {
  const user = useUser();
  const permissions = getUserPermissions(user.user);

  return ALL_NAV_LINKS.filter((link) => {
    const required = NAV_PERMISSIONS[link.id];
    return !required || required.some((p) => permissions.includes(p));
  });
};
