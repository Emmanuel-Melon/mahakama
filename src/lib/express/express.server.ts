import { logger } from "../logger";
import { shutdownBullMQ } from "../bullmq/bullmq.shutdown";

export const gracefulShutdown = async () => {
  logger.info("Stopping BullMQ queues and workers...");
  await shutdownBullMQ();
  process.exit(0);
};
