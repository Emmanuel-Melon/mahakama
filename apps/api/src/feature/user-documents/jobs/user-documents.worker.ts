import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { UserDocumentJobs } from "../user-documents.config";
import { cleanupExpiredUserDocuments } from "./user-documents.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { logger } from "@/lib/logger";

/**
 * User document job handler map
 */
const userDocumentHandlers: JobHandlerMap<Record<string, any>> = {
  [UserDocumentJobs.CleanupExpiredDocuments]: () =>
    cleanupExpiredUserDocuments(),
};

/**
 * Initialize the user documents worker
 */
export const initUserDocumentsWorker = () => {
  const worker = createBullWorker(QueueName.Scheduled, userDocumentHandlers, {
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
      "User document cleanup job failed",
    );
  });

  return worker;
};
