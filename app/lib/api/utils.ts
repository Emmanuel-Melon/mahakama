import { redirect } from "react-router";
import { jwtVerify } from 'jose';

export function getForwardHeaders(request: Request): HeadersInit {
  const isProduction = process.env.NODE_ENV === "production";

  const clientIp = isProduction
    ? // Production (Netlify)
      request.headers.get("X-NF-Client-Connection-IP") ||
      request.headers.get("X-Forwarded-For")?.split(",")[0].trim() ||
      request.headers.get("X-Real-IP") ||
      ""
    : // Development (localhost)
      request.headers.get("X-Forwarded-For")?.split(",")[0].trim() ||
      "127.0.0.1";

  const headers: Record<string, string> = {
    "User-Agent": request.headers.get("User-Agent") || "",
    Accept: request.headers.get("Accept") || "",
    "Accept-Language": request.headers.get("Accept-Language") || "",
    "Accept-Encoding": request.headers.get("Accept-Encoding") || "",

    // Forward the real client IP
    "X-Forwarded-For": clientIp,
    "X-Real-IP": clientIp,

    Referer: request.headers.get("Referer") || "",
    DNT: request.headers.get("DNT") || "",
    "Sec-CH-UA": request.headers.get("Sec-CH-UA") || "",
    "Sec-CH-UA-Mobile": request.headers.get("Sec-CH-UA-Mobile") || "",
    "Sec-CH-UA-Platform": request.headers.get("Sec-CH-UA-Platform") || "",
  };

  // Remove empty headers
  return Object.fromEntries(
    Object.entries(headers).filter(([_, value]) => value !== ""),
  );
}

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

export function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parseCookies(cookieHeader);
  const token = cookies?.token ?? null;
  return token;
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
  import.meta.env.VITE_JWT_SECRET || 'secret'
);

export async function decodeJWT(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}