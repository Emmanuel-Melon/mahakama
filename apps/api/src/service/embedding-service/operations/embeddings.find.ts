import { embeddingProvider, vectorStore } from "../embeddings.factory";
import { QueryEmbeddingOptions } from "../embeddings.types";

export const findEmbedding = async (
  queryString: string,
  options: QueryEmbeddingOptions,
) => {
  const { collectionName, limit } = options;
  const [queryEmbedding] = await embeddingProvider.embed([queryString]);
  const results = await vectorStore.query(
    collectionName,
    queryEmbedding,
    limit,
  );
  return results;
};
