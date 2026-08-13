import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { DocumentJobs } from "../document.config";
import { DocumentsJobHandler } from "./documents.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { DocumentJobMap } from "../documents.types";
import { markEmbeddingJobFailed } from "@/service/embedding-service/embeddings.persistence";
import { publishIngestionEvent } from "../documents.progress";
import { logger } from "@/lib/logger";

const documentsHandlers: JobHandlerMap<DocumentJobMap> = {
  [DocumentJobs.DocumentUploaded]: (data, job) =>
    DocumentsJobHandler.handleDocumentUploaded(data, job),
};

export const initDocumentsWorker = () => {
  const worker = createBullWorker<DocumentJobMap>(
    QueueName.Documents,
    documentsHandlers,
  );

  // BullMQ emits `failed` only after all retries are exhausted. Log it, persist
  // the failed status, and close the SSE stream with a terminal error event.
  worker.on("failed", (job, error) => {
    if (job.name !== DocumentJobs.DocumentUploaded) return;

    const { documentId } =
      job.data as DocumentJobMap[typeof DocumentJobs.DocumentUploaded];
    const isFinalFailure = job.attemptsMade >= (job.opts.attempts ?? 1);

    logger.error(
      {
        jobId: job.id,
        documentId,
        attemptsMade: job.attemptsMade,
        error,
      },
      "Document ingestion job failed",
    );

    // Defensive: `failed` should only fire once retries are exhausted, but
    // guard anyway so a transient failure is never surfaced as terminal.
    if (!isFinalFailure) return;

    markEmbeddingJobFailed(documentId, error);

    publishIngestionEvent(documentId, {
      type: "error",
      data: {
        message: error instanceof Error ? error.message : String(error),
        code: "INGESTION_FAILED",
      },
    });
  });

  return worker;
};
