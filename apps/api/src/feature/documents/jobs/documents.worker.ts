import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { DocumentJobs } from "../documents.config";
import { cleanupExpiredDocuments } from "./documents.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { logger } from "@/lib/logger";

/**
 * Document job handler map
 */
const documentHandlers: JobHandlerMap<Record<string, any>> = {
  [DocumentJobs.CleanupExpiredDocuments]: () => cleanupExpiredDocuments(),
};

/**
 * Initialize the documents worker
 */
export const initDocumentsWorker = () => {
  const worker = createBullWorker(QueueName.Scheduled, documentHandlers, {
    concurrency: 1, // Run cleanup jobs sequentially
  });

  worker.on("failed", (job, error) => {
    if (!job) return;

    logger.error(
      {
        jobId: job.id,
        jobName: job.name,
        error,
      },
      "Document cleanup job failed",
    );
  });

  return worker;
};
