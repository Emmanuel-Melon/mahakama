import { FetchApiClient } from "./fetch";
import type { components } from "./generated/api.types";
import { DOCUMENTS_API_ROUTES } from "~/feature/documents/DocumentsConfig";

export type Document = components["schemas"]["Document"];
export type DocumentResource = components["schemas"]["DocumentResource"];
export type DocumentSingleResponse = components["schemas"]["DocumentSingleResponse"];
export type DocumentsCollectionResponse = components["schemas"]["DocumentsCollectionResponse"];

export class DocumentsApiClient {
  private api: FetchApiClient;
  constructor() {
    this.api = new FetchApiClient();
  }
  public async getDocuments(
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<Document[]> {
    try {
      const response = await this.api.request<DocumentsCollectionResponse>(DOCUMENTS_API_ROUTES.ROOT, {
        headers: options.headers,
      });
      if (!response.data) {
        console.error("Invalid documents data:", response);
        throw new Error("Invalid documents data received from the server");
      }
      const documents = response.data.map((resource) => resource.attributes);
      return documents;
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      throw error;
    }
  }

  public async getDocumentById(
    documentId: string | number,
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<Document> {
    try {
      const response = await this.api.request<DocumentSingleResponse>(
        DOCUMENTS_API_ROUTES.DOCUMENT.replace(':documentId', String(documentId)),
        {
          headers: options.headers,
        },
      );
      if (!response.data.attributes) {
        console.error("Invalid document data:", response);
        throw new Error("Invalid document data received from the server");
      }
      return response.data.attributes;
    } catch (error) {
      console.error("Failed to fetch document:", error);
      throw error;
    }
  }
}

export const documentsApi = new DocumentsApiClient();
