import { logger } from "@/lib/logger";
import { queueManager } from "./index";
import { getActiveWorkers } from ".";
import { getRedisConnection } from "@/lib/redis";

export const shutdownBullMQ = async () => {
  const workers = getActiveWorkers();

  logger.info(`Stopping ${workers.length} workers...`);

  await Promise.all(
    workers.map((worker) =>
      worker
        .close()
        .catch((err) =>
          logger.error({ err, queue: worker.name }, "Error closing worker"),
        ),
    ),
  );

  logger.info("Closing all queue instances...");
  await queueManager.closeAll();

  const redis = getRedisConnection();
  if (redis.status !== "end") {
    await redis.quit();
    logger.info("Redis connection closed.");
  }
};
