import { z } from "zod";

export const ServerEndpointsSchema = z.object({
  api: z.string().min(1, "API endpoint is required"),
  docs: z.string().min(1, "Docs endpoint is required"),
  openApiSpec: z.string().min(1, "OpenAPI spec endpoint is required"),
  health: z.string().min(1, "Health check endpoint is required"),
});

export const ServerConfigSchema = z.object({
  port: z.number().int().min(1).max(65535),
  env: z.string().min(1, "Environment is required"),
  isProduction: z.boolean(),
  isDevelopment: z.boolean(),
  jwtSecret: z.string().optional(),
  hostname: z.string().min(1, "Hostname is required"),
  protocol: z.enum(["http", "https"]),
  baseUrl: z.string().url("Base URL must be a valid URL"),
  endpoints: ServerEndpointsSchema,
  shutdownTimeout: z.number().int().min(0),
  trustProxy: z.union([z.string(), z.number()]),
  environment: z.string(),
});

export const PostgresConfigSchema = z.object({
  url: z.string().url("PostgreSQL URL must be a valid URL"),
});

export const RedisConfigSchema = z.object({
  url: z.string().url().optional(),
  port: z.number().int().min(1).max(65535).optional(),
  host: z.string().optional(),
});

export const UpstashConfigSchema = z.object({
  restUrl: z.string().url().optional(),
  restToken: z.string().optional(),
  restPassword: z.string().optional(),
});

export const ChromaConfigSchema = z.object({
  chromaApiKey: z.string().optional(),
  chromaDatabase: z.string().optional(),
  chromaTenant: z.string().optional(),
});

export const OllamaConfigSchema = z.object({
  url: z.string().url("Ollama URL must be a valid URL"),
  model: z.string().optional(),
});

export const GeminiConfigSchema = z.object({
  apiKey: z.string().optional(),
  model: z.string().optional(),
});

export const SupabaseConfigSchema = z.object({
  url: z.string().url("Supabase URL must be a valid URL"),
  serviceKey: z.string().min(1, "Supabase service key is required"),
});

// Grouped Schemas
export const LLMConfigSchema = z.object({
  ollama: OllamaConfigSchema,
  gemini: GeminiConfigSchema,
});

export const PlatformConfigSchema = z.object({
  supabase: SupabaseConfigSchema,
});

export const DatabaseConfigSchema = z.object({
  postgres: PostgresConfigSchema,
  redis: RedisConfigSchema.optional(),
  chroma: ChromaConfigSchema.optional(),
});

export const ServicesConfigSchema = z.object({
  upstash: UpstashConfigSchema.optional(),
});

// Type definitions
export type IServerEndpoints = z.infer<typeof ServerEndpointsSchema>;
export type IServerConfig = z.infer<typeof ServerConfigSchema>;
export type IDatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
export type IRedisConfig = z.infer<typeof RedisConfigSchema>;
export type IUpstashConfig = z.infer<typeof UpstashConfigSchema>;
export type IChromaConfig = z.infer<typeof ChromaConfigSchema>;
export type IOllamaConfig = z.infer<typeof OllamaConfigSchema>;
export type IGeminiConfig = z.infer<typeof GeminiConfigSchema>;
export type ISupabaseConfig = z.infer<typeof SupabaseConfigSchema>;
export type ILLMConfig = z.infer<typeof LLMConfigSchema>;
export type IPlatformConfig = z.infer<typeof PlatformConfigSchema>;
export type IServicesConfig = z.infer<typeof ServicesConfigSchema>;
