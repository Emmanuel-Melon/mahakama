import { AppConfigSchema, type AppConfig } from "./config.types";

export const appConfig = AppConfigSchema.parse({
  api: {
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  },
  env: import.meta.env.VITE_ENV ?? "development",
  isProduction: import.meta.env.VITE_ENV === "production",
});

export default appConfig;
