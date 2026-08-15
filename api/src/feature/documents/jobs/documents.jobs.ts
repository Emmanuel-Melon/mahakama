import { Job } from "bullmq";
import { parsePdfFromPath, parsePdfFromUrl } from "@/lib/pdf-parse/";
import { getStoragePath } from "@/lib/storage/storage";
import { serverConfig } from "@/config";
import { chromaClient } from "@/lib/chroma";
import { chunkDocument } from "@/service/rag-service/rag.chunker";
import { generateDocumentEmbeddings } from "@/service/embedding-service/embeddings.generate";
import type { EmbeddingBatchProgress } from "@/service/embedding-service/embeddings.generate";
import type { DocumentChunk } from "@/service/embedding-service/embeddings.types";
import {
  EmbeddingJobStatus,
  markEmbeddingJobFailed,
  saveDocumentChunks,
  upsertEmbeddingJob,
} from "@/service/embedding-service/embeddings.persistence";
import { logger } from "@/lib/logger";
import { findDocumentById } from "../operations/document.find";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { DocumentJobs } from "../document.config";
import { DocumentUploadedPayload } from "../documents.types";
import { publishIngestionEvent } from "../documents.progress";

const COLLECTION_NAME = "legal_questions";
const CONTENT_PREVIEW_LENGTH = 200;

export type DocumentPipelineResult = {
  totalChunks: number;
  chunkVersion: number;
  title: string;
};

export type DocumentPipelineOptions = {
  onBatchProgress?: (
    progress: EmbeddingBatchProgress,
    latestChunk?: DocumentChunk,
  ) => void;
};

/**
 * Shared write-path pipeline used by the BullMQ job handler and the
 * `reingest:uploads` script: parse → chunk → enrich → persist → embed →
 * previous-version cleanup. Marks the embedding job failed (no throw) for
 * scan-only PDFs; callers decide how to surface that. Other errors propagate
 * so the caller can apply its own failure policy (worker retries / script
 * continues to the next file).
 */
export const processDocumentPipeline = async (
  documentId: string,
  options: DocumentPipelineOptions = {},
): Promise<DocumentPipelineResult> => {
  const document = unwrapJobResult(await findDocumentById(documentId), {
    message: "Could not find document",
    shouldRetry: false,
  });
  const { id, storageUrl, title } = document.data!;
  const { actName, jurisdiction, sourceUrl, lastUpdated, version } =
    document.data!;

  // 1. Read document and extract text. External http(s) URLs are fetched and
  //    parsed remotely; anything else is resolved to local storage.
  const isExternalUrl =
    /^https?:\/\//i.test(storageUrl) &&
    !storageUrl.startsWith(serverConfig.baseUrl);
  const fileContent = isExternalUrl
    ? await parsePdfFromUrl(storageUrl)
    : await parsePdfFromPath(getStoragePath(storageUrl));

  // 2. Chunk document into sections
  const chunks = chunkDocument(
    {
      documentId: id,
      title,
      text: fileContent.text,
    },
    {
      chunkSize: 1000, // characters
      overlapSize: 200,
    },
  );

  // 2b. Carry version + document-level citation metadata onto every chunk so
  //     Chroma and document_chunks record which version they belong to.
  const chunkVersion = version ?? 1;
  const enrichedChunks = chunks.map((chunk) => ({
    ...chunk,
    version: chunkVersion,
    documentId: id,
    actName: actName ?? undefined,
    // Deterministic ground-truth citation derived at ingest time (never left
    // for the LLM to infer). Section chunks get "Act, Section N"; preamble
    // chunks carry the act name only.
    fullCitation:
      actName && chunk.section
        ? `${actName}, ${chunk.section}`
        : actName
          ? actName
          : undefined,
    jurisdiction: jurisdiction ?? undefined,
    url: sourceUrl ?? undefined,
    lastUpdated: lastUpdated ?? undefined,
  }));

  // Image-only/scanned PDFs produce no text. Fail loudly instead of silently
  // "completing" with 0 chunks — and don't throw (no pointless retries for a
  // permanent condition).
  if (chunks.length === 0) {
    logger.warn(
      { documentId: id },
      "Document contains no extractable text; marking embedding job failed",
    );
    markEmbeddingJobFailed(id, new Error("PDF contains no extractable text"));
    return { totalChunks: 0, chunkVersion, title };
  }

  await upsertEmbeddingJob(id, {
    status: EmbeddingJobStatus.PROCESSING,
    totalChunks: enrichedChunks.length,
    error: null,
    startedAt: new Date(),
  });

  // 3. Persist chunk rows (Postgres audit cache — Chroma remains the vector store)
  await saveDocumentChunks(id, enrichedChunks);

  // 4. Generate and store embeddings, streaming progress per completed batch
  const onBatchProgress = options.onBatchProgress;
  await generateDocumentEmbeddings(
    enrichedChunks,
    {
      collectionName: COLLECTION_NAME,
      limit: 20,
    },
    onBatchProgress
      ? (progress) =>
          onBatchProgress(
            progress,
            enrichedChunks[progress.processedChunks - 1],
          )
      : undefined,
  );

  // 4b. Re-ingest policy (U1.4 default): delete the previous version's chunks
  //     from Chroma so stale law text is never retrieved. Newer versions have
  //     version-scoped ids, so the old ones remain addressable by metadata.
  if (chunkVersion > 1) {
    const deleted = await chromaClient.deleteDocuments(COLLECTION_NAME, {
      where: {
        $and: [{ document_id: id }, { version: chunkVersion - 1 }],
      },
    });
    logger.info(
      { documentId: id, deleted, fromVersion: chunkVersion - 1 },
      "Deleted previous version chunks from Chroma",
    );
  }

  await upsertEmbeddingJob(id, {
    status: EmbeddingJobStatus.COMPLETED,
    processedChunks: enrichedChunks.length,
    completedAt: new Date(),
  });

  return { totalChunks: enrichedChunks.length, chunkVersion, title };
};

export class DocumentsJobHandler {
  static async handleDocumentUploaded(
    data: DocumentUploadedPayload,
    job?: Job,
  ) {
    const { documentId, userId, filename, size } = data;

    const result = await processDocumentPipeline(documentId, {
      onBatchProgress: (progress, latestChunk) => {
        publishIngestionEvent(documentId, {
          type: "content",
          data: {
            chunk: progress.batchIndex,
            preview: (latestChunk?.content ?? "").slice(
              0,
              CONTENT_PREVIEW_LENGTH,
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

    logger.info({ documentId, userId }, "Document processed successfully");
    return { success: true, documentId, userId };
  }
}
