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

export const ClientConfigSchema = z.object({
  baseUrl: z.string().url("Client Base URL must be a valid URL"),
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

export const StorageConfigSchema = z.object({
  dir: z.string().min(1, "Storage directory is required"),
  maxUploadMb: z.number().int().positive(),
});

export const embeddingConfigSchema = z.object({
  model: z.string().default("nomic-embed-text"),
  dimensions: z.coerce.number().default(768),
  ollamaBaseUrl: z.string().default("http://localhost:11434"),
  // "chroma" | "pgvector" | "dual" — dual writes both, reads from primaryStore
  writeMode: z.enum(["chroma", "pgvector", "dual"]).default("pgvector"),
  primaryStore: z.enum(["chroma", "pgvector"]).default("pgvector"),
  // How often (ms) the shadow-write replay job runs when writeMode is "dual"
  replayIntervalMs: z.coerce.number().int().positive().default(300_000),
});

// Grouped Schemas
export const LLMConfigSchema = z.object({
  ollama: OllamaConfigSchema,
  gemini: GeminiConfigSchema,
});

export const DatabaseConfigSchema = z.object({
  postgres: PostgresConfigSchema,
  redis: RedisConfigSchema.optional(),
  chroma: ChromaConfigSchema.optional(),
});

export const LawSourceConfigSchema = z.object({
  enabled: z.boolean().default(false),
  uliiBaseUrl: z.string().url().optional(),
  uliiApiKey: z.string().optional(),
  checkCron: z.string().default("0 0 1 * *"),
});

export const ServicesConfigSchema = z.object({
  upstash: UpstashConfigSchema.optional(),
  lawSources: LawSourceConfigSchema.optional(),
});

export const RagConfigSchema = z.object({
  stalenessMonths: z.number().int().positive().default(24),
});

export const AuthConfigSchema = z.object({
  isProduction: z.boolean().default(process.env.NODE_ENV === "production"),
  cookieDomains: z
    .array(z.string())
    .default(
      process.env.COOKIE_DOMAINS?.split(",").map((s) => s.trim()) || [
        "localhost",
      ],
    ),
  issuer: z.string().default(process.env.AUTH_ISSUER || "mah-auth-service"),
  secrets: z.object({
    jwtSecret: z.string(),
    jwtRefreshSecret: z.string(),
    joseSecret: z.instanceof(Uint8Array),
  }),
  audience: z.object({
    USER: z.string().default(process.env.AUDIENCE_USER || "ivyi-app-user"),
    PARTNER: z
      .string()
      .default(process.env.AUDIENCE_PARTNER || "ivyi-app-partner"),
    ADMIN: z.string().default(process.env.AUDIENCE_ADMIN || "ivyi-app-admin"),
  }),
  tokens: z.object({
    access: z.literal("access").default("access"),
    refresh: z.literal("refresh").default("refresh"),
  }),
  timing: z.object({
    accessExpiration: z.number().default(60 * 60 * 1000), // 1 hour in MS
    refreshExpiration: z.number().default(30 * 24 * 60 * 60 * 1000), // 30 days in MS
  }),
});

export const CookieConfigSchema = z.object({
  cookieDomains: z.preprocess(
    (val) =>
      typeof val === "string" ? val.split(",").map((s) => s.trim()) : val,
    z.array(z.string()).default(["localhost"]),
  ),
  cookieSecure: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional(),
  ),
  cookieSameSite: z.enum(["lax", "strict", "none"]).optional(),
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
export type IStorageConfig = z.infer<typeof StorageConfigSchema>;
export type ILLMConfig = z.infer<typeof LLMConfigSchema>;
export type IServicesConfig = z.infer<typeof ServicesConfigSchema>;
export type ILawSourceConfig = z.infer<typeof LawSourceConfigSchema>;
export type IRagConfig = z.infer<typeof RagConfigSchema>;
export type IEmbeddingConfig = z.infer<typeof embeddingConfigSchema>;
export type IAuthConfig = z.infer<typeof AuthConfigSchema>;
export type ICookieConfig = z.infer<typeof CookieConfigSchema>;
export type IClientConfig = z.infer<typeof ClientConfigSchema>;
