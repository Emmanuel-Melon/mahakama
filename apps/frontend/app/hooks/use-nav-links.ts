import { useMemo } from "react";
import { useUser } from "~/context/user-provider";
import {
  BASE_NAV_LINKS,
  APP_NAV_LINKS,
  ROLE_NAV_LINKS,
} from "~/lib/nav/nav.config";
import type { NavLinkItem } from "@mah/client/nav";

export const useNavLinks = (): NavLinkItem[] => {
  const { user } = useUser();

  return useMemo(() => {
    const role = user?.role ?? "user";
    if (role === "admin") return [];

    const roleLinks = ROLE_NAV_LINKS[role] ?? APP_NAV_LINKS;
    const merged = [...roleLinks];
    for (const base of BASE_NAV_LINKS) {
      if (!merged.find((l) => l.id === base.id)) merged.push(base);
    }
    return merged;
  }, [user?.role]);
};
