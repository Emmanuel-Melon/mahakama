import dotenv from "dotenv";
import {
  ServerConfigSchema,
  DatabaseConfigSchema,
  LLMConfigSchema,
  StorageConfigSchema,
  ServicesConfigSchema,
  LawSourceConfigSchema,
  RagConfigSchema,
  embeddingConfigSchema,
  IServerConfig,
  IDatabaseConfig,
  ILLMConfig,
  IStorageConfig,
  IServicesConfig,
  ILawSourceConfig,
  IRagConfig,
  IEmbeddingConfig,
  IAuthConfig,
  AuthConfigSchema,
  CookieConfigSchema,
  ICookieConfig,
  ClientConfigSchema,
  IClientConfig,
} from "./config.types";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

// Server Configuration
export const serverConfig = ServerConfigSchema.parse({
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",
  jwtSecret: process.env.JWT_SECRET,
  hostname: process.env.HOSTNAME || "localhost",
  protocol: process.env.NODE_ENV === "production" ? "https" : "http",
  baseUrl:
    process.env.BASE_URL?.trim() ||
    `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
      process.env.HOSTNAME || "localhost"
    }:${Number(process.env.PORT) || 3000}`,
  endpoints: {
    api: "/api",
    docs: "/docs",
    openApiSpec: "/api-docs",
    health: "/health",
  },
  shutdownTimeout: 5000,
  trustProxy: process.env.TRUST_PROXY || "loopback",
  environment:
    process.env.NODE_ENV === "production" ? "production" : "development",
}) satisfies IServerConfig;

// Client Configuration
export const clientConfig = ClientConfigSchema.parse({
  baseUrl:
    process.env.CLIENT_URL?.trim() ||
    (process.env.NODE_ENV === "production"
      ? "https://app.yourproductiondomain.com"
      : process.env.NODE_ENV === "staging"
        ? "https://staging.yourproductiondomain.com"
        : "http://localhost:5173"),
}) satisfies IClientConfig;

// Database Configuration
export const dbConfig = DatabaseConfigSchema.parse({
  postgres: {
    url:
      process.env.DATABASE_URL || "postgres://postgres@localhost:5432/postgres",
  },
  redis: process.env.REDIS_URL
    ? {
        url: process.env.REDIS_URL,
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
        host: process.env.REDIS_HOST || "localhost",
      }
    : undefined,
  chroma: process.env.CHROMA_API_KEY
    ? {
        chromaApiKey: process.env.CHROMA_API_KEY,
        chromaDatabase: process.env.CHROMA_DATABASE,
        chromaTenant: process.env.CHROMA_TENANT,
      }
    : undefined,
}) satisfies IDatabaseConfig;

// LLM Configuration
export const llmConfig = LLMConfigSchema.parse({
  ollama: {
    url: process.env.OLLAMA_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-pro",
  },
}) satisfies ILLMConfig;

// Storage Configuration
export const storageConfig = StorageConfigSchema.parse({
  dir: process.env.UPLOADS_DIR || "uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 25,
}) satisfies IStorageConfig;

// Services Configuration
export const servicesConfig = ServicesConfigSchema.parse({
  upstash: process.env.UPSTASH_REDIS_REST_URL
    ? {
        restUrl: process.env.UPSTASH_REDIS_REST_URL,
        restToken: process.env.UPSTASH_REDIS_REST_TOKEN,
        restPassword: process.env.UPSTASH_REDIS_REST_PASSWORD,
      }
    : undefined,
}) satisfies IServicesConfig;

// Law source diff-check configuration (metadata-updates.md U3.3)
export const lawSourcesConfig = LawSourceConfigSchema.parse({
  enabled: process.env.LAW_SOURCES_ENABLED === "true",
  uliiBaseUrl: process.env.ULII_BASE_URL,
  uliiApiKey: process.env.ULII_API_KEY,
  checkCron: process.env.LAW_SOURCES_CRON || "0 0 1 * *",
}) satisfies ILawSourceConfig;

// RAG configuration (metadata-updates.md U4.1)
export const ragConfig = RagConfigSchema.parse({
  stalenessMonths: Number(process.env.RAG_STALENESS_MONTHS) || 24,
}) satisfies IRagConfig;

// Embedding configuration
export const embeddingConfig = embeddingConfigSchema.parse({
  model: process.env.EMBEDDING_MODEL,
  dimensions: process.env.EMBEDDING_DIMENSIONS,
  ollamaBaseUrl: process.env.EMBEDDING_OLLAMA_BASE_URL,
  writeMode: process.env.EMBEDDING_WRITE_MODE,
  primaryStore: process.env.EMBEDDING_PRIMARY_STORE,
  replayIntervalMs: process.env.EMBEDDING_REPLAY_INTERVAL_MS,
}) satisfies IEmbeddingConfig;

// Auth configuration
export const authConfig = AuthConfigSchema.parse({
  isProduction: process.env.NODE_ENV === "production",
  cookieDomains: process.env.COOKIE_DOMAINS?.split(",").map((s) =>
    s.trim(),
  ) || ["localhost"],
  secrets: {
    jwtSecret: process.env.JWT_SECRET || "secret",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "secret",
    joseSecret: new TextEncoder().encode(process.env.JWT_SECRET || "secret"),
  },
  issuer: process.env.AUTH_ISSUER,
  audience: {},
  tokens: {},
  timing: {},
}) as IAuthConfig;

export const cookieConfig = CookieConfigSchema.parse({
  cookieDomains: process.env.COOKIE_DOMAINS,
  cookieSecure: process.env.COOKIE_SECURE,
  cookieSameSite: process.env.COOKIE_SAMESITE,
}) satisfies ICookieConfig;

const config = {
  auth: authConfig,
  clientConfig: clientConfig,
  cookie: cookieConfig,
  server: serverConfig,
  db: dbConfig,
  llm: llmConfig,
  storage: storageConfig,
  services: servicesConfig,
  lawSources: lawSourcesConfig,
  rag: ragConfig,
  embedding: embeddingConfig,
};

// Export everything
export { config };
export default config;

// Environment
export const isDev = process.env.NODE_ENV !== "production";

// CORS
export const corsOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

// API Servers
export const mahakamaServers = [
  {
    url: `http://localhost:${serverConfig.port}${serverConfig.endpoints.api}`,
    description: "Local development server",
  },
  {
    url: "https://mahakama-api-production.up.railway.app/api",
    description: "Production server",
  },
];
