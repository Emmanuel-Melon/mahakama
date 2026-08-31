export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/login",
  "/signup",
] as const;

export const AUTH_ROUTES = [
  "/app",
  "/clients",
  "/documents",
  "/lawyers",
  "/chats",
  "/chat",
  "/consultations",
  "/matters",
  "/legal-hub",
  "/users",
] as const;

export const ALL_ROUTES = [...PUBLIC_ROUTES, ...AUTH_ROUTES] as const;

export function capitalizeRouteName(route: string): string {
  const parts = route.replace(/^\//, "").split("-");
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Home";
  const routePath = pathname.split("?")[0].split("#")[0];
  const matchedRoute = ALL_ROUTES.filter((route) =>
    routePath.startsWith(route),
  ).sort((a, b) => b.length - a.length)[0];

  if (matchedRoute) {
    return capitalizeRouteName(matchedRoute);
  }
  const firstSegment = routePath.split("/")[1];
  return firstSegment ? capitalizeRouteName(firstSegment) : "Mahakama";
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route),
  );
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function isAuthPageRoute(pathname: string): boolean {
  return pathname.startsWith("/login") || pathname.startsWith("/signup");
}
