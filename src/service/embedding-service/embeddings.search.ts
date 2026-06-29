import { chromaClient } from "@/lib/chroma";
import { QueryEmbeddingOptions } from "./embeddings.types";

export const searchEmbedding = async (
  queryString: string,
  options: QueryEmbeddingOptions,
) => {
  const { collectionName, limit } = options;
  const embeddings = await chromaClient.query({
    collectionName: collectionName,
    queryTexts: queryString,
    nResults: limit,
  });
  return embeddings;
};
