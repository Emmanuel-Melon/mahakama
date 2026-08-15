import { chromaClient } from "@/lib/chroma";
import { logger } from "@/lib/logger";
import type { DocumentChunk, QueryEmbeddingOptions } from "./embeddings.types";

export type EmbeddingBatchProgress = {
  batchIndex: number; // 1-based
  totalBatches: number;
  processedChunks: number;
  totalChunks: number;
};

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
    if (documentChunk.documentId) metadata.document_id = documentChunk.documentId;
    if (documentChunk.version !== undefined)
      metadata.version = documentChunk.version;

    documents.push(document);
    metadatas.push(metadata);
    // Version-scoped ids so re-ingesting a newer version never collides with
    // chunks of a previous version: `law_<chunkId>[-v<version>]`.
    const versionSuffix = documentChunk.version
      ? `-v${documentChunk.version}`
      : "";
    ids.push(`law_${documentChunk.id}${versionSuffix}`);
  }

  // Add documents to ChromaDB in batches to avoid timeouts
  const BATCH_SIZE = 20;
  const totalBatches = Math.ceil(documents.length / BATCH_SIZE);
  let importedCount = 0;
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batchDocs = documents.slice(i, i + BATCH_SIZE);
    const batchMetadatas = metadatas.slice(i, i + BATCH_SIZE);
    const batchIds = ids.slice(i, i + BATCH_SIZE);

    logger.info(
      `Importing batch ${i / BATCH_SIZE + 1} of ${totalBatches}...`,
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
        `Embedding verification failed: batch ${i / BATCH_SIZE + 1} expected ${batchIds.length} documents in "${collectionName}" but only ${stored?.ids?.length ?? 0} were stored`,
      );
    }

    importedCount += batchDocs.length;

    onBatchProgress?.({
      batchIndex: i / BATCH_SIZE + 1,
      totalBatches,
      processedChunks: importedCount,
      totalChunks: documents.length,
    });

    logger.info(`Imported ${importedCount}/${documents.length} documents`);
  }

  return importedCount;
};
