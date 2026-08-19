import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { CorpusJobs } from "../corpus.config";
import { CorpusJobHandler } from "./corpus.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { CorpusJobMap } from "../corpus.types";
import { markEmbeddingJobFailed } from "@/service/embedding-service/operations/embeddings.update";
import { publishIngestionEvent } from "../corpus.progress";
import { logger } from "@/lib/logger";

const corpusHandlers: JobHandlerMap<CorpusJobMap> = {
  [CorpusJobs.CorpusUploaded]: (data, job) =>
    CorpusJobHandler.handleCorpusUploaded(data, job),
};

export const initCorpusWorker = () => {
  const worker = createBullWorker<CorpusJobMap>(
    QueueName.Corpus,
    corpusHandlers,
  );

  // BullMQ emits `failed` only after all retries are exhausted. Log it, persist
  // the failed status, and close the SSE stream with a terminal error event.
  worker.on("failed", (job, error) => {
    if (!job) return;
    if (job.name !== CorpusJobs.CorpusUploaded) return;

    const { documentId } =
      job.data as CorpusJobMap[typeof CorpusJobs.CorpusUploaded];
    const isFinalFailure = job.attemptsMade >= (job.opts.attempts ?? 1);

    logger.error(
      {
        jobId: job.id,
        documentId,
        attemptsMade: job.attemptsMade,
        error,
      },
      "Corpus ingestion job failed",
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
