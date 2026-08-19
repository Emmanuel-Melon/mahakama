import { chromaClient } from "@/lib/chroma";
import { logger } from "@/lib/logger";
import type { VectorStore, VectorRecord } from "../embeddings.types";

export const chromaStore: VectorStore = {
  name: "chroma",

  async addDocuments(collectionName, records: VectorRecord[]) {
    await chromaClient.addDocuments({
      collectionName,
      ids: records.map((r) => r.id),
      documents: records.map((r) => r.document),
      embeddings: records.map((r) => r.embedding),
      metadatas: records.map((r) => r.metadata),
    });
  },

  async getDocumentsByIds(collectionName, ids) {
    return chromaClient.getDocumentsByIds(collectionName, ids);
  },

  async query(collectionName, queryEmbedding, nResults) {
    const result = await chromaClient.query({
      collectionName,
      queryEmbeddings: [queryEmbedding],
      nResults,
    });

    const rawIds = result.ids?.[0] ?? [];
    const rawDocuments = result.documents?.[0] ?? [];
    const rawMetadatas = result.metadatas?.[0] ?? [];
    const rawDistances = result.distances?.[0] ?? [];

    const ids: string[] = [];
    const documents: string[] = [];
    const metadatas: Record<string, unknown>[] = [];
    const distances: number[] = [];

    for (let i = 0; i < rawIds.length; i++) {
      const document = rawDocuments[i];
      const distance = rawDistances[i];

      // A null document or distance means Chroma has nothing usable at this
      // index (e.g. a stale/corrupted row) — drop the whole row rather than
      // defaulting to "" and letting empty legal text flow into an answer.
      if (document == null || distance == null) {
        logger.warn(
          { collectionName, id: rawIds[i] },
          "Dropping Chroma query result with null document or distance",
        );
        continue;
      }

      ids.push(rawIds[i]);
      documents.push(document);
      metadatas.push(rawMetadatas[i] ?? {});
      distances.push(distance);
    }

    return { ids, documents, metadatas, distances };
  },
};

export const readRecordsFromChroma = async (
  collectionName: string,
  ids: string[],
): Promise<VectorRecord[]> => {
  const result = await chromaClient.getDocumentsByIds(collectionName, ids);

  return ids
    .filter((_id, i) => result.embeddings?.[i] != null)
    .map((id, i) => ({
      id,
      document: result.documents?.[i] ?? "",
      embedding: result.embeddings![i],
      metadata: (result.metadatas?.[i] as Record<string, unknown>) ?? {},
    }));
};
