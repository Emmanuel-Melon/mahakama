export const AUTH_PAGE_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-account",
  "/verify-email-pending",
] as const;

export function isAuthPageRoute(pathname: string): boolean {
  return AUTH_PAGE_PATHS.some((path) => pathname.startsWith(path));
}
