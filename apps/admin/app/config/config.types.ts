import { z } from "zod";

export const ApiConfigSchema = z.object({
  baseURL: z.string().url("API base URL must be a valid URL"),
});

export const AppConfigSchema = z.object({
  api: ApiConfigSchema,
  env: z.enum(["development", "staging", "production"]),
  isProduction: z.boolean(),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
