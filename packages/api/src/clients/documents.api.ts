import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import { DOCUMENTS_API_ROUTES } from "../api.routes";
import {
  getClientToken,
  consumeSSEStream,
  handleSSEFetchError,
} from "../api/api.sse";
import type { components } from "../generated/api.types";

export type Document = components["schemas"]["Document"];
export type DocumentResource = components["schemas"]["DocumentResource"];
export type DocumentSingleResponse =
  components["schemas"]["DocumentSingleResponse"];
export type DocumentsCollectionResponse =
  components["schemas"]["DocumentCollectionResponse"];

export type DocumentMetadata = DocumentSingleResponse["metadata"];
export type DocumentResult = ApiResource<Document, DocumentMetadata>;

export type DocumentIngestionEvent =
  | {
      type: "started";
      data: { timestamp: string; filename: string; size: number };
    }
  | {
      type: "progress";
      data: {
        processed: number;
        total: number;
        percentage: number;
        chunk: number;
        totalChunks: number;
      };
    }
  | { type: "content"; data: { chunk: number; preview: string } }
  | {
      type: "completed";
      data: {
        filename: string;
        size: number;
        processedAt: string;
        totalChunks: number;
      };
    }
  | { type: "error"; data: { message: string; code?: string } };

export interface UploadDocumentOptions {
  title?: string;
  description?: string;
  type?: string;
}

export class DocumentsApiClient extends BaseApiClient {
  protected readonly path = DOCUMENTS_API_ROUTES.ROOT;

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async getDocuments(
    options: { headers?: Record<string, string> } = {},
  ): Promise<Document[]> {
    const response = await this.api.request<DocumentsCollectionResponse>(
      this.path,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackCollection(response, {
      errMsg: "Invalid documents data received from the server",
    });
  }

  public async getDocumentById(
    documentId: string | number,
    options: { headers?: Record<string, string> } = {},
  ): Promise<DocumentResult> {
    const route = DOCUMENTS_API_ROUTES.DOCUMENT.replace(
      ":documentId",
      String(documentId),
    );
    const response = await this.api.request<DocumentSingleResponse>(route, {
      headers: { ...this.defaultHeaders, ...options.headers },
    });

    return this.unpackSingle(response, {
      errMsg: "Invalid document data received from the server",
    });
  }

  public async uploadDocument(
    file: File,
    options: UploadDocumentOptions = {},
    onEvent: (event: DocumentIngestionEvent) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    if (options.title) formData.append("title", options.title);
    if (options.description)
      formData.append("description", options.description);
    if (options.type) formData.append("type", options.type);

    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
    const token = getClientToken();

    const response = await fetch(`${baseURL}${DOCUMENTS_API_ROUTES.INGEST}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      credentials: "include",
      signal,
    });

    if (!response.ok) {
      return handleSSEFetchError(
        response,
        `Upload failed with status ${response.status}`,
      );
    }

    await consumeSSEStream<DocumentIngestionEvent>(response, onEvent, signal);
  }
}

let _documentsApi: DocumentsApiClient | null = null;
export const documentsApi = new Proxy({} as DocumentsApiClient, {
  get(_, prop) {
    if (!_documentsApi) _documentsApi = new DocumentsApiClient();
    return _documentsApi[prop as keyof DocumentsApiClient];
  },
});
