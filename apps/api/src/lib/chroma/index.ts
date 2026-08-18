import { CloudClient } from "chromadb";
import { llmConfig, dbConfig } from "@/config";
import { OllamaEmbeddingFunction } from "@chroma-core/ollama";
import { AddDocumentsParams, QueryParams } from "./chroma.types";
import { logger } from "@/lib/logger";

export class ChromaClient {
  private static instance: ChromaClient;
  private _client: CloudClient;
  private _embedder: OllamaEmbeddingFunction;

  constructor() {
    this._client = new CloudClient({
      apiKey: dbConfig.chroma?.chromaApiKey,
      tenant: dbConfig.chroma?.chromaTenant,
      database: dbConfig.chroma?.chromaDatabase,
    });

    this._embedder = new OllamaEmbeddingFunction({
      url: llmConfig.ollama.url,
      model: "nomic-embed-text",
    });
  }

  public static getInstance(): ChromaClient {
    if (!ChromaClient.instance) {
      try {
        ChromaClient.instance = new ChromaClient();
      } catch (error) {
        logger.error(error, "Failed to initialize ChromaDB client:");
        throw error;
      }
    }
    return ChromaClient.instance;
  }

  public get client(): CloudClient {
    return this._client;
  }

  public get embedder(): OllamaEmbeddingFunction {
    return this._embedder;
  }

  public async getOrCreateCollection(name: string) {
    try {
      const collection = await this._client.getOrCreateCollection({
        name,
        embeddingFunction: this._embedder,
      });
      logger.info(`Connected to collection: ${name}`);
      return collection;
    } catch (error) {
      logger.error(
        { error, collectionName: name },
        "Failed to connect to Chroma collection",
      );
      throw error;
    }
  }

  public async addDocuments(params: AddDocumentsParams): Promise<string[]> {
    const { collectionName, documents, ids, metadatas, embeddings } = params;

    if (documents.length === 0) {
      logger.warn("No documents provided to add");
      return [];
    }

    if (embeddings && embeddings.length !== documents.length) {
      throw new Error(
        `addDocuments: embeddings length (${embeddings.length}) does not match documents length (${documents.length})`,
      );
    }

    const collection = await this.getOrCreateCollection(collectionName);

    const documentIds =
      ids ||
      Array.from(
        { length: documents.length },
        (_, i) => `doc_${Date.now()}_${i}`,
      );

    // When embeddings are supplied, Chroma stores them as-is and never
    // invokes the collection's embeddingFunction — the whole point of the
    // new embedding-service path. When omitted (old call sites still on
    // queryTexts-style ingestion), Chroma falls back to embedding via
    // `_embedder` itself, same as today.
    await collection.upsert({
      ids: documentIds,
      documents,
      metadatas,
      embeddings,
    });

    logger.info(
      `Added ${documents.length} documents to collection: ${collectionName}`,
    );
    return documentIds;
  }

  public async query(params: QueryParams) {
    const {
      collectionName,
      queryTexts,
      queryEmbeddings,
      nResults = 15,
    } = params;

    if (!queryTexts && !queryEmbeddings) {
      throw new Error("query() requires either queryTexts or queryEmbeddings");
    }

    const collection = await this.getOrCreateCollection(collectionName);

    return collection.query({
      queryTexts: queryEmbeddings
        ? undefined
        : Array.isArray(queryTexts)
          ? queryTexts
          : [queryTexts!],
      queryEmbeddings,
      nResults,
    });
  }

  public async peekCollection(collectionName: string) {
    const collection = await this.getOrCreateCollection(collectionName);
    return collection.peek({ limit: 10 });
  }

  public async countCollection(collectionName: string) {
    const collection = await this.getOrCreateCollection(collectionName);
    return collection.count();
  }

  public async getDocumentsByIds(collectionName: string, ids: string[]) {
    const collection = await this.getOrCreateCollection(collectionName);
    return collection.get({ ids });
  }

  public async deleteDocuments(
    collectionName: string,
    criteria: { ids?: string[]; where?: Record<string, unknown> },
  ): Promise<number> {
    const collection = await this.getOrCreateCollection(collectionName);
    const result = await collection.delete({
      ids: criteria.ids,
      where: criteria.where as never,
    });
    return result.deleted ?? 0;
  }
}

const chromaClient = ChromaClient.getInstance();

export { chromaClient };
