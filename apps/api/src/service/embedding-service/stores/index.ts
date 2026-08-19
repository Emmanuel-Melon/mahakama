import { db } from "@/lib/drizzle";
import { logger } from "@/lib/logger";
import { shadowWriteFailuresTable } from "../embeddings.schema";
import type { VectorStore, VectorRecord } from "../embeddings.types";
import { readRecordsFromPgvector } from "./pgvector.store";
import { readRecordsFromChroma } from "./chroma.store";

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
        try {
          await shadow.addDocuments(collectionName, records);
        } catch (err) {
          const ids = records.map((r) => r.id);
          logger.error(
            { err, store: shadow.name, ids },
            "Shadow store write failed — recording for replay",
          );
          await db.insert(shadowWriteFailuresTable).values({
            collectionName,
            recordIds: ids,
            shadowStore: shadow.name,
            primaryStore: primary.name,
            lastError: err instanceof Error ? err.message : String(err),
          });
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

export const readRecordsFromPrimary = async (
  primaryStore: string,
  collectionName: string,
  recordIds: string[],
): Promise<VectorRecord[]> => {
  if (primaryStore === "pgvector") {
    return readRecordsFromPgvector(collectionName, recordIds);
  }
  return readRecordsFromChroma(collectionName, recordIds);
};
