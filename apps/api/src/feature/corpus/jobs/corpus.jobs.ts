import { Job } from "bullmq";
import { logger } from "@/lib/logger";
import { CorpusUploadedPayload } from "../corpus.types";
import { publishIngestionEvent } from "../corpus.progress";
import { CORPUS_CONFIG } from "../corpus.config";
import { processCorpusPipeline } from "../operations/corpus.ingest";

export class CorpusJobHandler {
  static async handleCorpusUploaded(
    data: CorpusUploadedPayload,
    job?: Job,
  ) {
    const { documentId, userId, filename, size } = data;

    const result = await processCorpusPipeline(documentId, {
      onBatchProgress: (progress, latestChunk) => {
        publishIngestionEvent(documentId, {
          type: "content",
          data: {
            chunk: progress.batchIndex,
            preview: (latestChunk?.content ?? "").slice(
              0,
              CORPUS_CONFIG.CONTENT_PREVIEW_LENGTH,
            ),
          },
        });
        publishIngestionEvent(documentId, {
          type: "progress",
          data: {
            processed: progress.processedChunks,
            total: progress.totalChunks,
            percentage:
              progress.totalChunks > 0
                ? Math.round(
                    (progress.processedChunks / progress.totalChunks) * 100,
                  )
                : 100,
            chunk: progress.batchIndex,
            totalChunks: progress.totalChunks,
          },
        });
      },
    });

    if (result.totalChunks === 0) {
      publishIngestionEvent(documentId, {
        type: "error",
        data: {
          message:
            "The PDF contains no extractable text. It may be scanned or image-only.",
          code: "NO_EXTRACTABLE_TEXT",
        },
      });
      return { success: false, documentId, userId };
    }

    job?.updateProgress(100);

    publishIngestionEvent(documentId, {
      type: "completed",
      data: {
        filename: filename ?? result.title,
        size: size ?? 0,
        processedAt: new Date().toISOString(),
        totalChunks: result.totalChunks,
      },
    });

    logger.info({ documentId, userId }, "Corpus entry processed successfully");
    return { success: true, documentId, userId };
  }
}
