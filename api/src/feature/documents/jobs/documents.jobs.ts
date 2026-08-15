import { Job } from "bullmq";
import { parsePdfFromPath, parsePdfFromUrl } from "@/lib/pdf-parse/";
import { getStoragePath } from "@/lib/storage/storage";
import { serverConfig } from "@/config";
import { chromaClient } from "@/lib/chroma";
import { chunkDocument } from "@/service/rag-service/rag.chunker";
import { generateDocumentEmbeddings } from "@/service/embedding-service/embeddings.generate";
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

export class DocumentsJobHandler {
  static async handleDocumentUploaded(
    data: DocumentUploadedPayload,
    job?: Job,
  ) {
    const { documentId, userId, filename, size } = data;
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
      jurisdiction: jurisdiction ?? undefined,
      url: sourceUrl ?? undefined,
      lastUpdated: lastUpdated ?? undefined,
    }));

    // Image-only/scanned PDFs produce no text. Fail loudly instead of
    // silently "completing" with 0 chunks — and don't throw (no pointless
    // retries for a permanent condition).
    if (chunks.length === 0) {
      logger.warn(
        { documentId: id },
        "Document contains no extractable text; marking embedding job failed",
      );
      markEmbeddingJobFailed(id, new Error("PDF contains no extractable text"));
      publishIngestionEvent(id, {
        type: "error",
        data: {
          message:
            "The PDF contains no extractable text. It may be scanned or image-only.",
          code: "NO_EXTRACTABLE_TEXT",
        },
      });
      return { success: false, documentId: id, userId };
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
    await generateDocumentEmbeddings(
      enrichedChunks,
      {
        collectionName: COLLECTION_NAME,
        limit: 20,
      },
      ({ batchIndex, processedChunks, totalChunks }) => {
        const previewChunk = enrichedChunks[processedChunks - 1];
        publishIngestionEvent(id, {
          type: "content",
          data: {
            chunk: batchIndex,
            preview: (previewChunk?.content ?? "").slice(
              0,
              CONTENT_PREVIEW_LENGTH,
            ),
          },
        });
        publishIngestionEvent(id, {
          type: "progress",
          data: {
            processed: processedChunks,
            total: totalChunks,
            percentage:
              totalChunks > 0
                ? Math.round((processedChunks / totalChunks) * 100)
                : 100,
            chunk: batchIndex,
            totalChunks,
          },
        });
      },
    );
    job?.updateProgress(100);

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

    publishIngestionEvent(id, {
      type: "completed",
      data: {
        filename: filename ?? title,
        size: size ?? 0,
        processedAt: new Date().toISOString(),
        totalChunks: enrichedChunks.length,
      },
    });

    logger.info({ documentId, userId }, "Document processed successfully");
    return { success: true, documentId, userId };
  }
}
