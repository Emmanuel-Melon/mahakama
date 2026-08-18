import { logger } from "@/lib/logger";
import type { VectorStore, VectorRecord } from "../embeddings.types";

export const createCompositeStore = (opts: {
  primary: VectorStore;
  shadow?: VectorStore;
}): VectorStore => {
  const { primary, shadow } = opts;

  return {
    name: `composite(${primary.name}${shadow ? `+${shadow.name}` : ""})`,

    async addDocuments(collectionName, records: VectorRecord[]) {
      await primary.addDocuments(collectionName, records);
      if (shadow) {
        // Shadow write failures are logged, not thrown — during the
        // migration window, the primary store succeeding is what matters
        // for the request. A shadow-write failure means the non-primary
        // store drifts out of sync, which is acceptable since it's not
        // serving reads.
        try {
          await shadow.addDocuments(collectionName, records);
        } catch (err) {
          logger.error(
            { err, store: shadow.name, ids: records.map((r) => r.id) },
            "Shadow store write failed during migration window",
          );
        }
      }
    },

    async getDocumentsByIds(collectionName, ids) {
      return primary.getDocumentsByIds(collectionName, ids);
    },

    async query(collectionName, queryEmbedding, nResults) {
      return primary.query(collectionName, queryEmbedding, nResults);
    },
  };
};