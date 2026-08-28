import { redirect } from "react-router";
import { jwtVerify } from "jose";

export function parseCookies(
  cookieHeader: string | null,
): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );
}

const AUTH_COOKIE_NAMES = [
  "user_accessToken",
  "lawyer_accessToken",
  "admin_accessToken",
] as const;

export function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parseCookies(cookieHeader);
  for (const cookieName of AUTH_COOKIE_NAMES) {
    if (cookies?.[cookieName]) {
      return cookies[cookieName];
    }
  }
  return null;
}

export function requireAuth(request: Request) {
  const token = getAuthToken(request);
  if (!token) {
    throw redirect("/login");
  }
  return token;
}

export function getAuthHeaders(request: Request): HeadersInit {
  const token = getAuthToken(request);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const JWT_SECRET = new TextEncoder().encode(
  import.meta.env.VITE_JWT_SECRET || "secret",
);

export async function decodeJWT(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}
