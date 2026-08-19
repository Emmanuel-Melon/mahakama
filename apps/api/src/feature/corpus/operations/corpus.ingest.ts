import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { chromaClient } from "@/lib/chroma";
import { logger } from "@/lib/logger";
import { parsePdfFromUrl, parsePdfFromPath } from "@/lib/pdf-parse/index";
import { getStoragePath } from "@/lib/storage/storage";
import { generateDocumentEmbeddings } from "@/service/embedding-service/operations/embeddings.insert";
import { saveDocumentChunks } from "@/service/embedding-service/operations/embeddings.insert";
import {
  markEmbeddingJobFailed,
  upsertEmbeddingJob,
} from "@/service/embedding-service/operations/embeddings.update";
import { chunkDocument } from "@/service/rag-service/rag.chunker";
import { isExternalStorageUrl } from "@/utils/url";
import { CORPUS_CONFIG } from "../corpus.config";
import {
  CorpusPipelineOptions,
  CorpusPipelineResult,
} from "../corpus.types";
import { findCorpusEntry } from "./corpus.find";
import { EmbeddingJobStatus } from "@/service/embedding-service/embeddings.config";

/**
 * Shared write-path pipeline used by the BullMQ job handler and the
 * `reingest:uploads` script: parse → chunk → enrich → persist → embed →
 * previous-version cleanup. Marks the embedding job failed (no throw) for
 * scan-only PDFs; callers decide how to surface that. Other errors propagate
 * so the caller can apply its own failure policy (worker retries / script
 * continues to the next file).
 */
export const processCorpusPipeline = async (
  documentId: string,
  options: CorpusPipelineOptions = {},
): Promise<CorpusPipelineResult> => {
  const document = unwrapJobResult(await findCorpusEntry("id", documentId), {
    message: "Could not find document",
    shouldRetry: false,
  });
  const { id, storageUrl, title } = document.data!;
  const { actName, jurisdiction, sourceUrl, lastUpdated, version } =
    document.data!;

  // 1. Read document and extract text. External http(s) URLs are fetched and
  //    parsed remotely; anything else is resolved to local storage.
  const isExternalUrl = isExternalStorageUrl(storageUrl);
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
      collectionName: CORPUS_CONFIG.COLLECTION_NAME,
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
    const deleted = await chromaClient.deleteDocuments(
      CORPUS_CONFIG.COLLECTION_NAME,
      {
        where: {
          $and: [{ document_id: id }, { version: chunkVersion - 1 }],
        },
      },
    );
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
