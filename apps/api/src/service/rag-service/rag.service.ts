// rag.service.ts
import {
  type RAGContext,
  type RetrievalOptions,
  ragQuerySchema,
} from "./rag.types";
import { loadDocumentVersions } from "./rag.documents";
import { isChunkStale } from "./rag.staleness";
import { ragConfig } from "@/config";
import { logger } from "@/lib/logger";
import { findEmbedding } from "@/service/embedding-service/operations/embeddings.find";
import { RAG_CONTEXT_CONFIG } from "./rag.config";

export class RAGService {
  async retrieveContext(
    question: string,
    options: RetrievalOptions,
  ): Promise<RAGContext> {
    const {
      topK = RAG_CONTEXT_CONFIG.TOP_K,
      minSimilarity = RAG_CONTEXT_CONFIG.RELEVANCE_THRESHOLD,
    } = options;

    // Validate the question (throws on too-short/too-long input).
    ragQuerySchema.parse({ query: question });

    // Single Chroma query — Chroma embeds the question via nomic-embed-text.
    const results = await findEmbedding(question, {
      collectionName: options.collectionName,
      limit: topK,
    });

    if (!results?.ids?.[0]?.length) {
      return { chunks: [], sources: [] };
    }

    const chunks: RAGContext["chunks"] = [];
    const seenSources = new Map<string, RAGContext["sources"][number]>();
    const documentIds = new Set<string>();

    // Collect document ids first so a single batched query gives us the
    // current version of every cited document (metadata-updates.md U4.1).
    for (let i = 0; i < results.ids[0].length; i++) {
      const metadata = (results.metadatas?.[0]?.[i] ?? {}) as Record<
        string,
        unknown
      >;
      const documentId = metadata.document_id
        ? String(metadata.document_id)
        : undefined;
      if (documentId) documentIds.add(documentId);
    }

    const documentVersions = await loadDocumentVersions(
      Array.from(documentIds),
    );

    for (let i = 0; i < results.ids[0].length; i++) {
      const metadata = (results.metadatas?.[0]?.[i] ?? {}) as Record<
        string,
        unknown
      >;
      const document = String(results.documents?.[0]?.[i] ?? "");
      const distance =
        typeof results.distances?.[0]?.[i] === "number"
          ? (results.distances[0][i] as number)
          : 0;
      const similarity = Math.max(0, Math.min(1, 1 - distance));

      if (similarity < minSimilarity) {
        continue;
      }

      const id = String(results.ids[0][i]);
      const title = String(metadata.title ?? "Unknown source");
      const section = metadata.section ? String(metadata.section) : null;
      const fullCitation = metadata.full_citation
        ? String(metadata.full_citation)
        : undefined;
      const url = metadata.url ? String(metadata.url) : undefined;
      const actName = metadata.act_name ? String(metadata.act_name) : undefined;
      const jurisdiction = metadata.jurisdiction
        ? String(metadata.jurisdiction)
        : undefined;
      const lastUpdated = metadata.last_updated
        ? String(metadata.last_updated)
        : undefined;
      const documentId = metadata.document_id
        ? String(metadata.document_id)
        : undefined;
      const version =
        metadata.version !== undefined ? Number(metadata.version) : undefined;
      const stale = isChunkStale({
        version,
        documentId,
        lastUpdated,
        currentVersion: documentId
          ? documentVersions.get(documentId)
          : undefined,
        stalenessMonths: ragConfig.stalenessMonths,
      });

      // Documents are stored as "<title>. <content>" — strip the leading
      // title so the LLM sees the raw provision text.
      let content = document;
      if (title && content.startsWith(title)) {
        content = content.slice(title.length).trim();
        if (content.startsWith(". ")) content = content.slice(1).trim();
      }

      chunks.push({
        content,
        title,
        section,
        similarity,
        fullCitation,
        url,
        actName,
        jurisdiction,
        lastUpdated,
        stale,
      });

      const sourceKey = fullCitation ?? `${title}|${section ?? ""}`;
      if (!seenSources.has(sourceKey)) {
        seenSources.set(sourceKey, {
          id,
          title,
          category: metadata.category ? String(metadata.category) : undefined,
          source: metadata.source ? String(metadata.source) : undefined,
          section,
          similarity,
          fullCitation,
          url,
          actName,
          jurisdiction,
          lastUpdated,
          content,
          stale,
        });
      }
    }

    logger.info(
      {
        chunks: chunks.length,
        sources: seenSources.size,
        staleChunks: chunks.filter((chunk) => chunk.stale).length,
        query: question,
      },
      "Retrieved RAG context",
    );

    return { chunks, sources: Array.from(seenSources.values()) };
  }
}

export const ragService = new RAGService();
