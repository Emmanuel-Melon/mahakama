import dotenv from "dotenv";
import {
  ServerConfigSchema,
  DatabaseConfigSchema,
  LLMConfigSchema,
  StorageConfigSchema,
  ServicesConfigSchema,
  IServerConfig,
  IDatabaseConfig,
  ILLMConfig,
  IStorageConfig,
  IServicesConfig,
} from "./config.types";
dotenv.config();

// Test Server Configuration
export const testServerConfig = ServerConfigSchema.parse({
  port: 3001, // Different port for testing
  env: "test",
  isProduction: false,
  isDevelopment: false,
  jwtSecret: "test-jwt-secret-key",
  hostname: "localhost",
  protocol: "http",
  baseUrl: "http://localhost:3001",
  endpoints: {
    api: "/api",
    docs: "/docs",
    openApiSpec: "/api-docs",
    health: "/health",
  },
  shutdownTimeout: 5000,
  trustProxy: "loopback",
  environment: "test",
}) satisfies IServerConfig;

// Test Database Configuration
export const testDbConfig = DatabaseConfigSchema.parse({
  postgres: {
    url:
      process.env.TEST_DATABASE_URL ||
      "postgres://postgres@localhost:5432/mahakama_test",
  },
  redis: process.env.TEST_REDIS_URL
    ? {
        url: process.env.TEST_REDIS_URL,
        port: process.env.TEST_REDIS_PORT
          ? Number(process.env.TEST_REDIS_PORT)
          : 6380,
        host: process.env.TEST_REDIS_HOST || "localhost",
      }
    : undefined,
  chroma: process.env.TEST_CHROMA_API_KEY
    ? {
        chromaApiKey: process.env.TEST_CHROMA_API_KEY,
        chromaDatabase: process.env.TEST_CHROMA_DATABASE || "mahakama_test",
        chromaTenant: process.env.TEST_CHROMA_TENANT || "test",
      }
    : undefined,
}) satisfies IDatabaseConfig;

// Test LLM Configuration
export const testLlmConfig = LLMConfigSchema.parse({
  ollama: {
    url: process.env.TEST_OLLAMA_URL || "http://localhost:11434",
    model: process.env.TEST_OLLAMA_MODEL || "llama2",
  },
  gemini: {
    apiKey: process.env.TEST_GEMINI_API_KEY || "test-gemini-key",
    model: process.env.TEST_GEMINI_MODEL || "gemini-pro",
  },
}) satisfies ILLMConfig;

// Test Storage Configuration
export const testStorageConfig = StorageConfigSchema.parse({
  dir: process.env.TEST_UPLOADS_DIR || "uploads-test",
  maxUploadMb: Number(process.env.TEST_MAX_UPLOAD_MB) || 25,
}) satisfies IStorageConfig;

// Test Services Configuration
export const testServicesConfig = ServicesConfigSchema.parse({
  upstash: process.env.TEST_UPSTASH_REDIS_REST_URL
    ? {
        restUrl: process.env.TEST_UPSTASH_REDIS_REST_URL,
        restToken: process.env.TEST_UPSTASH_REDIS_REST_TOKEN,
        restPassword: process.env.TEST_UPSTASH_REDIS_REST_PASSWORD,
      }
    : undefined,
}) satisfies IServicesConfig;

const testConfig = {
  server: testServerConfig,
  db: testDbConfig,
  llm: testLlmConfig,
  storage: testStorageConfig,
  services: testServicesConfig,
};

// Export everything
export { testConfig };
export default testConfig;

// Test Environment
export const isTest = true;

// Test CORS
export const testCorsOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

// Test API Servers
export const testMahakamaServers = [
  {
    url: `http://localhost:${testServerConfig.port}${testServerConfig.endpoints.api}`,
    description: "Test server",
  },
];
