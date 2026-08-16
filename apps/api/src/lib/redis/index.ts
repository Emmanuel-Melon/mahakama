import Redis, { RedisOptions } from "ioredis";
import { dbConfig } from "@/config";
import { logger } from "@/lib/logger";

const getRedisOptions = (): RedisOptions => {
  const redisUrl = dbConfig.redis?.url || "redis://127.0.0.1:6379";
  // ioredis accepts a URL string directly — don't destructure into host/port
  return {
    // CRITICAL: BullMQ requires this to be null to handle its own retries
    maxRetriesPerRequest: null,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  };
};

let redisInstance: Redis | null = null;

export const getRedisConnection = (): Redis => {
  if (!redisInstance) {
    const options = getRedisOptions();
    redisInstance = new Redis(options);
    const redisUrl = dbConfig.redis?.url || "redis://127.0.0.1:6379";

    redisInstance = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    redisInstance.on("error", (err) =>
      logger.error({ error: err }, "Redis Error:"),
    );
    redisInstance.on("connect", () => logger.info("✅ Redis connected"));
  }
  return redisInstance;
};
