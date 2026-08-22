// API configuration
export const API_CONFIG = {
  // Get base URL from environment variable with fallback to localhost
  get BASE_URL() {
    return (
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
    ).replace(/\/+$/, ""); // Remove trailing slashes
  },
};

import { AppConfigSchema, type AppConfig } from "./config.types";

export const appConfig = AppConfigSchema.parse({
  api: {
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  },
  env: import.meta.env.VITE_ENV ?? "development",
  isProduction: import.meta.env.VITE_ENV === "production",
  vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  sentry: {
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sampleRate: import.meta.env.VITE_SENTRY_SAMPLE_RATE
      ? parseFloat(import.meta.env.VITE_SENTRY_SAMPLE_RATE)
      : undefined,
  },
}) satisfies AppConfig;

export default appConfig;

export const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];
