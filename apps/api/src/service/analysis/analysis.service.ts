import { logger } from "@/lib/logger";
import { parsePdf, parsePdfFromPath, parsePdfFromUrl } from "@/lib/pdf-parse";
import { chromaClient } from "@/lib/chroma";
import { embeddingProvider } from "@/service/embedding-service/embeddings.factory";
import { EMBEDDING_CONFIG } from "@/service/embedding-service/embeddings.config";
import { chunkDocument } from "@/service/rag-service/rag.chunker";
import { analyzeDocument } from "./analysis.core";
import { ANALYSIS_TYPES, DOCUMENT_ANALYSIS_CONFIG } from "./analysis.config";
import type {
  DocumentSource,
  ProcessDocumentInput,
  ProcessDocumentResult,
  RAGPipelineResult,
} from "./analysis.types";

export class DocumentAnalysisService {
  /**
   * Extract text from a document source. Accepts a local path, an in-memory
   * buffer, a remote URL, or already-extracted text.
   */
  private async extractText(source: DocumentSource): Promise<string> {
    if ("text" in source) {
      return source.text;
    }

    if ("filePath" in source) {
      const parsed = await parsePdfFromPath(source.filePath);
      return parsed.text ?? "";
    }

    if ("fileUrl" in source) {
      const parsed = await parsePdfFromUrl(source.fileUrl);
      return parsed.text ?? "";
    }

    if ("fileBuffer" in source) {
      const parsed = await parsePdf(source.fileBuffer);
      return parsed.text ?? "";
    }

    throw new Error("Unsupported document source");
  }

  /**
   * Index a document's text into a vector collection via the RAG pipeline:
   * chunk -> embed -> store. Returns chunk stats.
   */
  private async indexForRag({
    text,
    fileName,
    collectionName,
    documentId,
    chunkSize = DOCUMENT_ANALYSIS_CONFIG.CHUNK_SIZE,
    overlapSize = DOCUMENT_ANALYSIS_CONFIG.CHUNK_OVERLAP,
  }: {
    text: string;
    fileName: string;
    collectionName: string;
    documentId?: string;
    chunkSize?: number;
    overlapSize?: number;
  }): Promise<RAGPipelineResult> {
    if (!text || text.trim().length === 0) {
      throw new Error("PDF contains no extractable text");
    }

    const chunks = chunkDocument(
      { documentId: documentId ?? fileName, title: fileName, text },
      { chunkSize, overlapSize },
    );

    if (chunks.length === 0) {
      throw new Error("Document produced no chunks");
    }

    // Embed and store in batches to bound concurrency on the Ollama embed
    // endpoint.
    const batchSize = EMBEDDING_CONFIG.BATCH_SIZE;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);

      const texts = batch.map((c) => c.content);
      const embeddings = await embeddingProvider.embed(texts);

      const records = batch.map((c) => c.content);
      const ids = batch.map((c) => `${documentId ?? fileName}_${c.chunkIndex}`);
      const metadatas = batch.map((c) => ({
        content: c.content,
        chunkIndex: c.chunkIndex,
        documentId: documentId ?? null,
        fileName,
        title: fileName,
        uploadedAt: new Date().toISOString(),
      }));

      await chromaClient.addDocuments({
        collectionName,
        documents: records,
        ids,
        metadatas,
        embeddings,
      });
    }

    logger.info(
      {
        fileName,
        chunkCount: chunks.length,
        collectionName,
      },
      "Document indexed for RAG",
    );

    return { totalChunks: chunks.length, collectionName };
  }

  /**
   * Run the full document pipeline: extract text (PDF parsing if needed),
   * index into a vector collection (optional RAG step), then run LLM analysis.
   *
   * @returns Extracted text, RAG indexing result (when enabled), and the
   *          structured analysis output.
   */
  async process(input: ProcessDocumentInput): Promise<ProcessDocumentResult> {
    const { fileName, analysisType = ANALYSIS_TYPES.FULL, rag } = input;

    const text = await this.extractText(input);

    if (!text || text.trim().length === 0) {
      throw new Error("Document contains no extractable text");
    }

    const ragResult = rag?.collectionName
      ? await this.indexForRag({
          text,
          fileName,
          collectionName: rag.collectionName,
          documentId: rag.documentId,
          chunkSize: rag.chunkSize,
          overlapSize: rag.overlapSize,
        })
      : null;

    const analysis = await analyzeDocument(analysisType, fileName, text);

    return { text, rag: ragResult, analysis };
  }
}

export const documentAnalysisService = new DocumentAnalysisService();
