import { FetchApiClient } from "./fetch";
import { parseCookies } from "./api.utils";
import type { components } from "./generated/api.types";
import { DOCUMENTS_API_ROUTES } from "~/feature/documents/DocumentsConfig";

export type Document = components["schemas"]["Document"];
export type DocumentResource = components["schemas"]["DocumentResource"];
export type DocumentSingleResponse =
  components["schemas"]["DocumentSingleResponse"];
export type DocumentsCollectionResponse =
  components["schemas"]["DocumentsCollectionResponse"];

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

const getClientToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = parseCookies(document.cookie);
  return cookies.token ?? null;
};

const parseSSEBlock = (
  block: string,
): { type: string; data: DocumentIngestionEvent["data"] } | null => {
  const lines = block.split("\n");
  let type = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.replace(/\r$/, "");
    if (trimmed.startsWith(":")) continue; // comment / keep-alive
    if (trimmed.startsWith("event:")) {
      type = trimmed.slice(6).trim();
    } else if (trimmed.startsWith("data:")) {
      dataLines.push(trimmed.slice(5).trim());
    }
  }

  if (dataLines.length === 0) return null;
  return { type, data: JSON.parse(dataLines.join("\n")) };
};

export class DocumentsApiClient {
  private api: FetchApiClient;
  constructor() {
    this.api = new FetchApiClient();
  }
  public async getDocuments(): Promise<Document[]> {
    try {
      const response = await this.api.request<DocumentsCollectionResponse>(
        DOCUMENTS_API_ROUTES.ROOT,
      );
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

  public async getDocumentById(documentId: string | number): Promise<Document> {
    try {
      const response = await this.api.request<DocumentSingleResponse>(
        DOCUMENTS_API_ROUTES.DOCUMENT.replace(
          ":documentId",
          String(documentId),
        ),
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
      let message = `Upload failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        message =
          errorData.errors?.[0]?.detail ||
          errorData.errors?.[0]?.title ||
          message;
      } catch {
        // Non-JSON error body — keep the status fallback message.
      }
      throw new Error(message);
    }

    if (!response.body) {
      throw new Error("No response body received from the server");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const parsed = parseSSEBlock(block);
        if (parsed) {
          onEvent(parsed as DocumentIngestionEvent);
        }
        boundary = buffer.indexOf("\n\n");
      }
    }
  }
}

export const documentsApi = new DocumentsApiClient();
