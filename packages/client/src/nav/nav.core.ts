import type { NavLinkItem } from "./nav.types";

export function createUseNavLinks<TUser>(
  allLinks: NavLinkItem[],
  navPermissions: Record<string, string[]>,
  useUserHook: () => TUser | null,
  getUserPermissions: (user: TUser | null) => string[],
) {
  return function useNavLinks() {
    const user = useUserHook();
    const permissions = getUserPermissions(user);

    return allLinks.filter((link) => {
      const required = navPermissions[link.id];
      return !required || required.some((p) => permissions.includes(p));
    });
  };
}