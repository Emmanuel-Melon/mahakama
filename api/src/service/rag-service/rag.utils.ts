import { SimilarityResult, ChromaSimilarityResult } from "./rag.types";

export const toSimilarityResult = (
  chromaResult: ChromaSimilarityResult,
): SimilarityResult => {
  return {
    ...chromaResult,
    id: parseInt(chromaResult.id, 10) || 0,
    embeddingLength: chromaResult.embedding.length,
  };
};
