import { Job } from "bullmq";
import { parsePdfFromPath } from "@/lib/pdf-parse/";
import { getStoragePath } from "@/lib/storage/storage";
import { chunkDocument } from "@/service/rag-service/rag.chunker";
import { generateDocumentEmbeddings } from "@/service/embedding-service/embeddings.generate";
import {
  EmbeddingJobStatus,
  saveDocumentChunks,
  upsertEmbeddingJob,
} from "@/service/embedding-service/embeddings.persistence";
import { logger } from "@/lib/logger";
import { findDocumentById } from "../operations/document.find";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { DocumentJobs } from "../document.config";
import { DocumentJobMap } from "../documents.types";
import { publishIngestionEvent } from "../documents.progress";

const COLLECTION_NAME = "legal_questions";
const CONTENT_PREVIEW_LENGTH = 200;

export class DocumentsJobHandler {
  static async handleDocumentUploaded(
    data: DocumentJobMap[typeof DocumentJobs.DocumentUploaded],
    job?: Job,
  ) {
    const { documentId, userId, filename, size } = data;
    const document = unwrapJobResult(await findDocumentById(documentId), {
      message: "Could not find document",
      shouldRetry: false,
    });
    const { id, storageUrl, title } = document.data!;

    // 1. Read document from local storage and extract text
    const fileContent = await parsePdfFromPath(getStoragePath(storageUrl));

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

    await upsertEmbeddingJob(id, {
      status: EmbeddingJobStatus.PROCESSING,
      totalChunks: chunks.length,
      error: null,
      startedAt: new Date(),
    });

    // 3. Persist chunk rows (Postgres audit cache — Chroma remains the vector store)
    await saveDocumentChunks(id, chunks);

    // 4. Stream per-chunk content + progress ahead of embedding
    chunks.forEach((chunk, index) => {
      publishIngestionEvent(id, {
        type: "content",
        data: {
          chunk: index + 1,
          preview: chunk.content.slice(0, CONTENT_PREVIEW_LENGTH),
        },
      });
      publishIngestionEvent(id, {
        type: "progress",
        data: {
          processed: index + 1,
          total: chunks.length,
          percentage: Math.round(((index + 1) / chunks.length) * 100),
          chunk: index + 1,
          totalChunks: chunks.length,
        },
      });
    });
    job?.updateProgress(100);

    // 5. Generate and store embeddings
    await generateDocumentEmbeddings(chunks, {
      collectionName: COLLECTION_NAME,
      limit: 20,
    });

    await upsertEmbeddingJob(id, {
      status: EmbeddingJobStatus.COMPLETED,
      processedChunks: chunks.length,
      completedAt: new Date(),
    });

    publishIngestionEvent(id, {
      type: "completed",
      data: {
        filename: filename ?? title,
        size: size ?? 0,
        processedAt: new Date().toISOString(),
        totalChunks: chunks.length,
      },
    });

    logger.info({ documentId, userId }, "Document processed successfully");
    return { success: true, documentId, userId };
  }
}
