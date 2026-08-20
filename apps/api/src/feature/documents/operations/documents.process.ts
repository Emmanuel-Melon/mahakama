import { v4 as uuidv4 } from "uuid";
import { chromaClient } from "@/lib/chroma";
import { logger } from "@/lib/logger";
import { parsePdf } from "@/lib/pdf-parse";
import { chunkDocument } from "@/service/rag-service/rag.chunker";
import { embeddingProvider } from "@/service/embedding-service/embeddings.factory";
import { getDocumentCollectionName } from "@/lib/chroma/chroma.config";
import {
  type SessionDocumentChunkMetadata,
  type SessionDocumentStatus,
} from "../documents.types";
import { DocumentConfig } from "../documents.config";

/**
 * Process a document upload: parse PDF, chunk, embed, and store
 * in a session-scoped ChromaDB collection.
 *
 * @param sessionId - The chat session ID
 * @param fileBuffer - The PDF file buffer
 * @param filename - Original filename
 * @param onProgress - Optional callback for progress updates
 * @returns Processing result with chunk count
 */
export async function processDocument(
  sessionId: string,
  fileBuffer: Buffer,
  filename: string,
  onProgress?: (event: { type: string; data: Record<string, unknown> }) => void,
): Promise<{ totalChunks: number; collectionName: string }> {
  const collectionName = getDocumentCollectionName(sessionId);
  const uploadedAt = new Date().toISOString();

  onProgress?.({
    type: "started",
    data: { timestamp: uploadedAt, filename, size: fileBuffer.length },
  });

  // 1. Parse PDF
  let text: string;
  try {
    const data = await parsePdf(fileBuffer);
    text = data.text;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse PDF";
    onProgress?.({
      type: "error",
      data: { message, code: "PARSE_ERROR" },
    });
    throw new Error(`PDF parsing failed: ${message}`);
  }

  if (!text || text.trim().length === 0) {
    onProgress?.({
      type: "error",
      data: {
        message: "PDF contains no extractable text",
        code: "NO_TEXT_CONTENT",
      },
    });
    throw new Error("PDF contains no extractable text");
  }

  // 2. Chunk document
  const chunks = chunkDocument(
    { documentId: sessionId, title: filename, text },
    {
      chunkSize: DocumentConfig.CHUNK_SIZE,
      overlapSize: DocumentConfig.CHUNK_OVERLAP,
    },
  );

  if (chunks.length === 0) {
    onProgress?.({
      type: "error",
      data: { message: "Document produced no chunks", code: "NO_CHUNKS" },
    });
    throw new Error("Document produced no chunks");
  }

  onProgress?.({
    type: "progress",
    data: {
      processed: 0,
      total: chunks.length,
      percentage: 0,
      chunk: 0,
      totalChunks: chunks.length,
    },
  });

  // 3. Generate embeddings and store in session collection
  const batchSize = DocumentConfig.CHUNK_SIZE;
  let processedCount = 0;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const texts = batch.map((c) => c.content);
    const embeddings = await embeddingProvider.embed(texts);

    const documents: string[] = [];
    const ids: string[] = [];
    const metadatas: Record<string, unknown>[] = [];

    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];
      const chunkIndex = i + j;
      const chunkId = `user_doc_${sessionId}_${chunkIndex}`;

      documents.push(chunk.content);
      ids.push(chunkId);
      metadatas.push({
        content: chunk.content,
        chunkIndex,
        sessionId,
        uploadedAt,
        filename,
        totalChunks: chunks.length,
        title: filename,
        // User documents don't have legal metadata
        section: chunk.section ?? null,
      });
    }

    await chromaClient.addDocuments({
      collectionName,
      documents,
      ids,
      metadatas,
      embeddings,
    });

    processedCount += batch.length;
    onProgress?.({
      type: "progress",
      data: {
        processed: processedCount,
        total: chunks.length,
        percentage: Math.round((processedCount / chunks.length) * 100),
        chunk: Math.min(i + batchSize, chunks.length),
        totalChunks: chunks.length,
      },
    });
  }

  logger.info(
    { sessionId, filename, chunkCount: chunks.length, collectionName },
    "Document processed successfully",
  );

  onProgress?.({
    type: "completed",
    data: {
      timestamp: new Date().toISOString(),
      filename,
      size: fileBuffer.length,
      totalChunks: chunks.length,
    },
  });

  return { totalChunks: chunks.length, collectionName };
}

/**
 * Check if a document exists for a session
 * @param sessionId - The chat session ID
 * @returns Document status with metadata
 */
export async function getDocumentStatus(
  sessionId: string,
): Promise<SessionDocumentStatus> {
  const collectionName = getDocumentCollectionName(sessionId);

  try {
    const count = await chromaClient.countCollection(collectionName);

    if (count === 0) {
      return {
        sessionId,
        status: "completed",
        hasDocument: false,
      };
    }

    // Get a sample to extract metadata
    const peek = await chromaClient.peekCollection(collectionName);
    const firstMetadata = peek.metadatas?.[0] as Record<string, unknown> | null;

    return {
      sessionId,
      status: "completed",
      hasDocument: true,
      filename: firstMetadata?.filename as string | undefined,
      totalChunks: count,
      uploadedAt: firstMetadata?.uploadedAt as string | undefined,
    };
  } catch (error) {
    // Collection doesn't exist
    return {
      sessionId,
      status: "completed",
      hasDocument: false,
    };
  }
}

/**
 * Delete a document collection
 * @param sessionId - The chat session ID
 * @returns True if deleted, false if collection didn't exist
 */
export async function deleteDocument(sessionId: string): Promise<boolean> {
  const collectionName = getDocumentCollectionName(sessionId);

  try {
    const count = await chromaClient.countCollection(collectionName);

    if (count === 0) {
      return false;
    }

    // Get all document IDs in the collection
    const peek = await chromaClient.peekCollection(collectionName);
    const ids = peek.ids as string[];

    if (ids.length > 0) {
      await chromaClient.deleteDocuments(collectionName, { ids });
    }

    logger.info(
      { sessionId, collectionName, deletedChunks: ids.length },
      "Document collection deleted",
    );

    return true;
  } catch (error) {
    logger.error(
      { sessionId, collectionName, error },
      "Failed to delete document collection",
    );
    return false;
  }
}

/**
 * Check if a session has an associated document collection
 * @param sessionId - The chat session ID
 * @returns True if the collection exists and has documents
 */
export async function sessionHasDocument(sessionId: string): Promise<boolean> {
  const collectionName = getDocumentCollectionName(sessionId);

  try {
    const count = await chromaClient.countCollection(collectionName);
    return count > 0;
  } catch {
    return false;
  }
}
