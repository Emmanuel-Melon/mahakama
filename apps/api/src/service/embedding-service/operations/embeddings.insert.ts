import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import type {
  DocumentChunk,
  EmbeddingBatchProgress,
  EmbeddingJobUpdate,
  QueryEmbeddingOptions,
} from "../embeddings.types";
import { documentChunksTable, embeddingJobsTable } from "../embeddings.schema";
import { EMBEDDING_CONFIG, EmbeddingJobStatus } from "../embeddings.config";
import { calculateTokenCount } from "@/lib/js-tiktoken";
import { chromaClient } from "@/lib/chroma";

export async function saveDocumentChunks(
  documentId: string,
  chunks: DocumentChunk[],
): Promise<number> {
  if (!chunks.length) {
    return 0;
  }

  // Idempotent across job retries — clear any rows from a previous attempt.
  await db
    .delete(documentChunksTable)
    .where(eq(documentChunksTable.documentId, documentId));

  await db.insert(documentChunksTable).values(
    chunks.map((chunk, index) => ({
      documentId,
      content: chunk.content,
      chunkIndex: index,
      section: chunk.section ?? null,
      actName: chunk.actName ?? null,
      fullCitation: chunk.fullCitation ?? null,
      url: chunk.url ?? null,
      jurisdiction: chunk.jurisdiction ?? null,
      lastUpdated: chunk.lastUpdated ?? null,
      version: chunk.version ?? null,
      tokenCount: calculateTokenCount(chunk.content),
    })),
  );

  logger.info(
    { documentId, chunkCount: chunks.length },
    "Persisted document chunks",
  );
  return chunks.length;
}

export const generateDocumentEmbeddings = async (
  documentChunks: DocumentChunk[],
  options: QueryEmbeddingOptions,
  onBatchProgress?: (progress: EmbeddingBatchProgress) => void,
) => {
  const { collectionName } = options;
  // Prepare documents and metadata
  const documents: string[] = [];
  const metadatas: any[] = [];
  const ids: string[] = [];
  for (const documentChunk of documentChunks) {
    const document = `${documentChunk.title}. ${documentChunk.content}`;
    // Create metadata object
    const metadata: Record<string, unknown> = {
      id: documentChunk.id.toString(),
      title: documentChunk.title,
      content_length: documentChunk.content.length,
      imported_at: new Date().toISOString(),
    };

    // Legal context metadata (omitted when absent — Chroma rejects undefined)
    if (documentChunk.section) metadata.section = documentChunk.section;
    if (documentChunk.category) metadata.category = documentChunk.category;
    if (documentChunk.source) metadata.source = documentChunk.source;

    // Citation metadata (omitted when absent — Chroma rejects undefined)
    if (documentChunk.actName) metadata.act_name = documentChunk.actName;
    if (documentChunk.section) metadata.section_number = documentChunk.section;
    if (documentChunk.fullCitation)
      metadata.full_citation = documentChunk.fullCitation;
    if (documentChunk.url) metadata.url = documentChunk.url;
    if (documentChunk.jurisdiction)
      metadata.jurisdiction = documentChunk.jurisdiction;
    if (documentChunk.lastUpdated)
      metadata.last_updated = documentChunk.lastUpdated;

    // Versioning metadata (see metadata-updates.md U1)
    if (documentChunk.documentId)
      metadata.document_id = documentChunk.documentId;
    if (documentChunk.version !== undefined)
      metadata.version = documentChunk.version;

    documents.push(document);
    metadatas.push(metadata);
    // Version-scoped ids so re-ingesting a newer version never collides with
    // chunks of a previous version: `law_<chunkId>[-v<version>]`.
    const versionSuffix = documentChunk.version
      ? `-v${documentChunk.version}`
      : "";
    ids.push(
      `${EMBEDDING_CONFIG.ID_PREFIX}${documentChunk.id}${versionSuffix}`,
    );
  }

  // Add documents to ChromaDB in batches to avoid timeouts
  const totalBatches = Math.ceil(
    documents.length / EMBEDDING_CONFIG.BATCH_SIZE,
  );
  let importedCount = 0;
  for (let i = 0; i < documents.length; i += EMBEDDING_CONFIG.BATCH_SIZE) {
    const batchDocs = documents.slice(i, i + EMBEDDING_CONFIG.BATCH_SIZE);
    const batchMetadatas = metadatas.slice(i, i + EMBEDDING_CONFIG.BATCH_SIZE);
    const batchIds = ids.slice(i, i + EMBEDDING_CONFIG.BATCH_SIZE);

    logger.info(
      `Importing batch ${i / EMBEDDING_CONFIG.BATCH_SIZE + 1} of ${totalBatches}...`,
    );

    await chromaClient.addDocuments({
      collectionName: collectionName,
      documents: batchDocs,
      metadatas: batchMetadatas,
      ids: batchIds,
    });

    // Verify the batch was actually stored. `get` returns the ids regardless
    // of whether they were written by this attempt or a previous (retried)
    // one, so this check is retry-safe — unlike a raw count delta, which
    // would not grow for ids re-upserted after a partial failure.
    const stored = await chromaClient.getDocumentsByIds(
      collectionName,
      batchIds,
    );
    if ((stored?.ids?.length ?? 0) < batchIds.length) {
      throw new Error(
        `Embedding verification failed: batch ${i / EMBEDDING_CONFIG.BATCH_SIZE + 1} expected ${batchIds.length} documents in "${collectionName}" but only ${stored?.ids?.length ?? 0} were stored`,
      );
    }

    importedCount += batchDocs.length;

    onBatchProgress?.({
      batchIndex: i / EMBEDDING_CONFIG.BATCH_SIZE + 1,
      totalBatches,
      processedChunks: importedCount,
      totalChunks: documents.length,
    });

    logger.info(`Imported ${importedCount}/${documents.length} documents`);
  }

  return importedCount;
};
