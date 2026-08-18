// src/service/embedding-service/embeddings.utils.ts
import { EMBEDDING_CONFIG } from "./embeddings.config";
import type { DocumentChunk, EmbeddingProvider } from "./embeddings.types";

export const buildChunkId = (chunk: DocumentChunk): string => {
  const versionSuffix = chunk.version ? `-v${chunk.version}` : "";
  return `${EMBEDDING_CONFIG.ID_PREFIX}${chunk.id}${versionSuffix}`;
};

export const buildChunkMetadata = (
  chunk: DocumentChunk,
  provider: EmbeddingProvider,
): Record<string, unknown> => {
  const metadata: Record<string, unknown> = {
    id: chunk.id.toString(),
    title: chunk.title,
    content_length: chunk.content.length,
    imported_at: new Date().toISOString(),
    // Provenance — lets you filter/reindex by provider later without
    // guessing which model produced a given vector.
    embedding_provider: provider.name,
    embedding_model: provider.model,
  };

  if (chunk.section) metadata.section = chunk.section;
  if (chunk.category) metadata.category = chunk.category;
  if (chunk.source) metadata.source = chunk.source;
  if (chunk.actName) metadata.act_name = chunk.actName;
  if (chunk.fullCitation) metadata.full_citation = chunk.fullCitation;
  if (chunk.url) metadata.url = chunk.url;
  if (chunk.jurisdiction) metadata.jurisdiction = chunk.jurisdiction;
  if (chunk.lastUpdated) metadata.last_updated = chunk.lastUpdated;
  if (chunk.documentId) metadata.document_id = chunk.documentId;
  if (chunk.version !== undefined) metadata.version = chunk.version;

  return metadata;
};