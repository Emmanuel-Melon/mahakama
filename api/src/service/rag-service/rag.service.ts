import { type RAGContext, type RetrievalOptions, ragQuerySchema } from "./rag.types";
import { searchEmbedding } from "@/service/embedding-service/embeddings.search";
import { logger } from "@/lib/logger";

const RELEVANCE_THRESHOLD = 0.7;

export class RAGService {
  async retrieveContext(
    question: string,
    options: RetrievalOptions,
  ): Promise<RAGContext> {
    const { topK = 5, minSimilarity = RELEVANCE_THRESHOLD } = options;

    // Validate the question (throws on too-short/too-long input).
    ragQuerySchema.parse({ query: question });

    // Single Chroma query — Chroma embeds the question via nomic-embed-text.
    const results = await searchEmbedding(question, {
      collectionName: options.collectionName,
      limit: topK,
    });

    if (!results?.ids?.[0]?.length) {
      return { chunks: [], sources: [] };
    }

    const chunks: RAGContext["chunks"] = [];
    const seenSources = new Map<string, RAGContext["sources"][number]>();

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

      // Documents are stored as "<title>. <content>" — strip the leading
      // title so the LLM sees the raw provision text.
      let content = document;
      if (title && content.startsWith(title)) {
        content = content.slice(title.length).trim();
        if (content.startsWith(". ")) content = content.slice(1).trim();
      }

      chunks.push({ content, title, section, similarity });

      const sourceKey = `${title}|${section ?? ""}`;
      if (!seenSources.has(sourceKey)) {
        seenSources.set(sourceKey, {
          id,
          title,
          category: metadata.category ? String(metadata.category) : undefined,
          source: metadata.source ? String(metadata.source) : undefined,
          section,
          similarity,
        });
      }
    }

    logger.info(
      { chunks: chunks.length, sources: seenSources.size, query: question },
      "Retrieved RAG context",
    );

    return { chunks, sources: Array.from(seenSources.values()) };
  }
}

export const ragService = new RAGService();
