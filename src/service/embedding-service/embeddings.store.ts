import { chromaClient } from "@/lib/chroma";
import { QueryEmbeddingOptions } from "./embeddings.types";

export const storeEmbedding = async (
  queryString: string,
  options: QueryEmbeddingOptions,
) => {
  const { collectionName } = options;
  const results = await chromaClient.query({
    collectionName: collectionName,
    queryTexts: queryString,
  });
  return results;
};
