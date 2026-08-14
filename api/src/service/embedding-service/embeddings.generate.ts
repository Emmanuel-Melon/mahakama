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

    documents.push(document);
    metadatas.push(metadata);
    ids.push(`law_${documentChunk.id}`);
  }

  // Add documents to ChromaDB in batches to avoid timeouts
  const BATCH_SIZE = 20;
  const totalBatches = Math.ceil(documents.length / BATCH_SIZE);
  const initialCount = await chromaClient.countCollection(collectionName);
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
    importedCount += batchDocs.length;

    onBatchProgress?.({
      batchIndex: i / BATCH_SIZE + 1,
      totalBatches,
      processedChunks: importedCount,
      totalChunks: documents.length,
    });

    logger.info(`Imported ${importedCount}/${documents.length} documents`);
  }

  const collectionCount = await chromaClient.countCollection(collectionName);
  const expectedCount = (initialCount ?? 0) + documents.length;
  if ((collectionCount ?? 0) < expectedCount) {
    throw new Error(
      `Embedding verification failed: expected at least ${expectedCount} documents in "${collectionName}" but found ${collectionCount}`,
    );
  }
  return collectionCount;
};
