import { Queue, Job } from "bullmq";
import { logger } from "../logger";
import { JobError } from "./bullmq.error";

export const getQueueStats = async (queue: Queue) => {
  const counts = await queue.getJobCounts();
  return {
    counts,
    isEmpty: counts.waiting + counts.active + counts.delayed === 0,
  };
};

export async function processBullJob<T>(
  label: string,
  job: Job,
  action: () => Promise<T>,
) {
  try {
    return await action();
  } catch (error) {
    if (error instanceof JobError && !error.shouldRetry) {
      // Logic to move to "failed" without retrying further
      await job.discard();
      logger.error({ label }, `❌ Job discarded: ${error.message}`);
    }
    throw error; // Standard BullMQ retry behavior
  }
}

export function unwrapJobResult<T>(
  result: T | null | undefined,
  options: { message: string; shouldRetry?: boolean },
): T {
  if (!result) {
    throw new JobError(options.message, options.shouldRetry ?? true);
  }
  return result;
}
