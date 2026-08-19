import type { AxiosRequestConfig } from "axios";
import { getApiConfig } from "../api/api.config";

/**
 * Strips formatting parameters (Secure, HttpOnly, Path) out of incoming Set-Cookie headers
 * to safely package them for subsequent outbound Cookie header blocks.
 */
export function parseSetCookiesToCookieHeader(setCookies: string[]): string {
  return setCookies
    .map((cookieStr) => cookieStr.split(";")[0])
    .filter(Boolean)
    .join("; ");
}

export function createBaseConfig(overrides: Partial<AxiosRequestConfig>) {
  const { baseURL, timeout } = getApiConfig();
  return {
    baseURL,
    timeout,
    withCredentials: true,
    ...overrides,
  };
}

export function mergeCookieHeader(
  existingCookieHeader: string | undefined,
  setCookies: string[],
): string {
  const existing = parseCookieHeader(existingCookieHeader ?? "");
  const incoming = parseSetCookiesToCookieHeader(setCookies)
    .split("; ")
    .reduce<Record<string, string>>((acc, pair) => {
      const [k, v] = pair.split("=");
      if (k) acc[k.trim()] = v ?? "";
      return acc;
    }, {});

  return Object.entries({ ...existing, ...incoming })
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

export function parseCookieHeader(header: string): Record<string, string> {
  return header.split("; ").reduce<Record<string, string>>((acc, pair) => {
    const [k, v] = pair.split("=");
    if (k) acc[k.trim()] = v ?? "";
    return acc;
  }, {});
}
