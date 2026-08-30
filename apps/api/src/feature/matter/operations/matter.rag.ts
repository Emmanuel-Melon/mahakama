import { logger } from "@/lib/logger";
import { parsePdfFromPath } from "@/lib/pdf-parse";
import { getStoragePath } from "@/lib/storage/storage";
import { chromaClient } from "@/lib/chroma";
import { getMatterCollectionName } from "@/lib/chroma/chroma.config";
import { embeddingProvider } from "@/service/embedding-service/embeddings.factory";
import { EMBEDDING_CONFIG } from "@/service/embedding-service/embeddings.config";
import { chunkDocument } from "@/service/rag-service/rag.chunker";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

/**
 * Process a matter document for RAG: parse the persisted PDF, chunk it, embed
 * the chunks, and store them in a matter-scoped Chroma collection
 * (`matter_docs_{matterId}`).
 *
 * This is the write/processing path only — retrieval wiring (querying the
 * collection as chat context) is intentionally out of scope.
 *
 * @param matterId - The owning matter ID
 * @param documentId - The matter_documents row ID
 * @param fileUrl - The persisted file URL (resolved to local storage)
 * @param fileName - Original file name for chunk metadata/title
 * @returns Total chunk count processed
 */
export async function processMatterDocument({
  matterId,
  documentId,
  fileUrl,
  fileName,
}: {
  matterId: string;
  documentId: string;
  fileUrl: string;
  fileName: string;
}): Promise<{ totalChunks: number; collectionName: string }> {
  const collectionName = getMatterCollectionName(matterId);

  const fileContent = await parsePdfFromPath(getStoragePath(fileUrl));

  if (!fileContent.text || fileContent.text.trim().length === 0) {
    throw new Error("PDF contains no extractable text");
  }

  const chunks = chunkDocument(
    { documentId, title: fileName, text: fileContent.text },
    { chunkSize: CHUNK_SIZE, overlapSize: CHUNK_OVERLAP },
  );

  if (chunks.length === 0) {
    throw new Error("Document produced no chunks");
  }

  // Embed and store in batches to bound concurrency on the Ollama embed endpoint.
  const batchSize = EMBEDDING_CONFIG.BATCH_SIZE;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    const texts = batch.map((c) => c.content);
    const embeddings = await embeddingProvider.embed(texts);

    const documents = batch.map((c) => c.content);
    const ids = batch.map((c) => `${documentId}_${c.chunkIndex}`);
    const metadatas = batch.map((c) => ({
      content: c.content,
      chunkIndex: c.chunkIndex,
      matterId,
      documentId,
      fileName,
      title: fileName,
      uploadedAt: new Date().toISOString(),
    }));

    await chromaClient.addDocuments({
      collectionName,
      documents,
      ids,
      metadatas,
      embeddings,
    });
  }

  logger.info(
    {
      matterId,
      documentId,
      fileName,
      chunkCount: chunks.length,
      collectionName,
    },
    "Matter document processed successfully",
  );

  return { totalChunks: chunks.length, collectionName };
}
