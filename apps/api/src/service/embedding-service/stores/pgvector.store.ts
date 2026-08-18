import { sql, cosineDistance, inArray, eq } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { documentChunksTable } from "../embeddings.schema";
import type { VectorStore, VectorRecord } from "../embeddings.types";

export const pgVectorStore: VectorStore = {
  name: "pgvector",

  async addDocuments(_collectionName, records: VectorRecord[]) {
    // documentChunksTable rows already exist from saveDocumentChunks (the
    // Postgres metadata write) — this fills in the embedding column. Using
    // UPDATE, not INSERT: if the metadata row isn't there yet, this is a
    // no-op update, not a new row, so the mismatch shows up as a verification
    // failure rather than a duplicate/orphaned row.
    const results = await Promise.all(
      records.map((r) =>
        db
          .update(documentChunksTable)
          .set({
            embedding: r.embedding,
            embeddingProvider: r.metadata.embedding_provider as string,
            embeddingModel: r.metadata.embedding_model as string,
          })
          .where(eq(documentChunksTable.id, r.id))
          .returning({ id: documentChunksTable.id }),
      ),
    );

    const updatedIds = new Set(results.flat().map((r) => r.id));
    const missing = records.filter((r) => !updatedIds.has(r.id));
    if (missing.length) {
      throw new Error(
        `pgVectorStore.addDocuments: ${missing.length} record(s) had no matching row in document_chunks — metadata write must run before the embedding fill. Missing ids: ${missing.map((r) => r.id).join(", ")}`,
      );
    }
  },

  async getDocumentsByIds(_collectionName, ids) {
    const rows = await db
      .select({ id: documentChunksTable.id })
      .from(documentChunksTable)
      .where(inArray(documentChunksTable.id, ids));
    return { ids: rows.map((r) => r.id) };
  },

  async query(_collectionName, queryEmbedding, nResults = 5) {
    const similarity = sql<number>`1 - (${cosineDistance(documentChunksTable.embedding, queryEmbedding)})`;
    const rows = await db
      .select({
        id: documentChunksTable.id,
        content: documentChunksTable.content,
        title: documentChunksTable.actName, // best available title-ish field
        section: documentChunksTable.section,
        fullCitation: documentChunksTable.fullCitation,
        url: documentChunksTable.url,
        actName: documentChunksTable.actName,
        jurisdiction: documentChunksTable.jurisdiction,
        lastUpdated: documentChunksTable.lastUpdated,
        documentId: documentChunksTable.documentId,
        version: documentChunksTable.version,
        similarity,
      })
      .from(documentChunksTable)
      .where(sql`${documentChunksTable.embedding} IS NOT NULL`)
      .orderBy((t) => sql`${t.similarity} DESC`)
      .limit(nResults);

    return {
      ids: rows.map((r) => r.id),
      documents: rows.map((r) => r.content),
      metadatas: rows.map((r) => ({
        title: r.title,
        section: r.section,
        full_citation: r.fullCitation,
        url: r.url,
        act_name: r.actName,
        jurisdiction: r.jurisdiction,
        last_updated: r.lastUpdated,
        document_id: r.documentId,
        version: r.version,
      })),
      distances: rows.map((r) => 1 - r.similarity),
    };
  },
};