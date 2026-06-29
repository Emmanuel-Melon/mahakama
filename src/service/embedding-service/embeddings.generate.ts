import { chromaClient } from "@/lib/chroma";
import { logger } from "@/lib/logger";
import type { DocumentChunk, QueryEmbeddingOptions } from "./embeddings.types";
import { documentChunksTable } from "./embeddings.schema";

export const generateTextEmbedding = async (
  queryString: string,
  options: QueryEmbeddingOptions,
) => {
  const { collectionName } = options;
  // we need to ensure that chunks work well with chroma's expected `documents`
  const embedding = await chromaClient.query({
    collectionName: collectionName,
    queryTexts: queryString,
  });
  return embedding;
};

export const generateDocumentEmbeddings = async (
  documentChunks: DocumentChunk[],
  options: QueryEmbeddingOptions,
) => {
  const { collectionName } = options;
  // Prepare documents and metadata
  const documents: string[] = [];
  const metadatas: any[] = [];
  const ids: string[] = [];
  for (const documentChunk of documentChunks) {
    const document = `${documentChunk.title}. ${documentChunk.content}`;
    // Create metadata object
    const metadata = {
      id: documentChunk.id.toString(),
      title: documentChunk.title,
      content_length: documentChunk.content.length,
      imported_at: new Date().toISOString(),
    };

    documents.push(document);
    metadatas.push(metadata);
    ids.push(`law_${documentChunk.id}`);
  }

  // Add documents to ChromaDB in batches to avoid timeouts
  const BATCH_SIZE = 20;
  let importedCount = 0;
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batchDocs = documents.slice(i, i + BATCH_SIZE);
    const batchMetadatas = metadatas.slice(i, i + BATCH_SIZE);
    const batchIds = ids.slice(i, i + BATCH_SIZE);

    logger.info(
      `Importing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(documents.length / BATCH_SIZE)}...`,
    );

    await chromaClient.addDocuments({
      collectionName: collectionName,
      documents: batchDocs,
      metadatas: batchMetadatas,
      ids: batchIds,
    });
    importedCount += batchDocs.length;
    logger.info(`Imported ${importedCount}/${documents.length} documents`);
  }

  const collectionCount = await chromaClient.countCollection(collectionName);
  return collectionCount;
};
