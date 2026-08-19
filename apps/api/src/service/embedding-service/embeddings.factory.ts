import { config } from "@/config";
import { createOllamaProvider } from "./providers/ollama.provider";
import { chromaStore } from "./stores/chroma.store";
import { pgVectorStore } from "./stores/pgvector.store";
import { createCompositeStore } from "./stores";
import type { EmbeddingProvider, VectorStore } from "./embeddings.types";

export const embeddingProvider: EmbeddingProvider = createOllamaProvider(
  config.embedding.ollamaBaseUrl,
  config.embedding.model,
  config.embedding.dimensions,
);

const createStore = (): VectorStore => {
  const { writeMode, primaryStore } = config.embedding;
  const primary = primaryStore === "pgvector" ? pgVectorStore : chromaStore;
  const shadow =
    writeMode === "dual"
      ? primaryStore === "pgvector"
        ? chromaStore
        : pgVectorStore
      : undefined;
  return createCompositeStore({ primary, shadow });
};

export const vectorStore: VectorStore = createStore();
