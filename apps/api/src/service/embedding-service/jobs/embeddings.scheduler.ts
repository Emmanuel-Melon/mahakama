import { config } from "@/config";
import { logger } from "@/lib/logger";
import { embeddingsQueue } from "./embeddings.queue";
import { EmbeddingsJobs } from "../embeddings.config";

/**
 * Register the shadow-write replay scheduler. Runs only when writeMode is
 * "dual" — otherwise there are no shadow writes to replay. The job is
 * idempotent: `upsertJobScheduler` is safe to call on every boot.
 */
export const registerShadowReplayScheduler = async () => {
  if (config.embedding.writeMode !== "dual") {
    logger.info("Shadow replay disabled — writeMode is not dual");
    return;
  }

  const intervalMs = config.embedding.replayIntervalMs;
  const intervalSec = Math.round(intervalMs / 1000);

  await embeddingsQueue.upsertJobScheduler(
    EmbeddingsJobs.Replay,
    { every: intervalMs },
    {
      name: EmbeddingsJobs.Replay,
      data: { triggeredBy: "scheduler" },
    },
  );

  logger.info({ everySeconds: intervalSec }, "Shadow write replay scheduled");
};
