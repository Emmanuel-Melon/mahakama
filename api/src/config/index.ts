import dotenv from "dotenv";
import {
  ServerConfigSchema,
  DatabaseConfigSchema,
  LLMConfigSchema,
  PlatformConfigSchema,
  ServicesConfigSchema,
  IServerConfig,
  IDatabaseConfig,
  ILLMConfig,
  IPlatformConfig,
  IServicesConfig,
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

// Platform Configuration
export const platformConfig = PlatformConfigSchema.parse({
  supabase: {
    url: process.env.SUPABASE_URL || "https://your-project.supabase.co",
    serviceKey: process.env.SUPABASE_PUBLISHABLE_KEY || "",
  },
}) satisfies IPlatformConfig;

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

const config = {
  server: serverConfig,
  db: dbConfig,
  llm: llmConfig,
  platform: platformConfig,
  services: servicesConfig,
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
