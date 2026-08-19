import { createApiClient, AxiosApiClient } from "../axios";
import { BaseApiClient } from "../api";
import {
  getClientToken,
  consumeSSEStream,
  handleSSEFetchError,
} from "../api/api.sse";

/**
 * Document upload event types (SSE)
 */
export type SessionDocumentEvent =
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
  | {
      type: "completed";
      data: {
        timestamp: string;
        filename: string;
        size: number;
        totalChunks: number;
      };
    }
  | {
      type: "error";
      data: { message: string; code?: string; details?: unknown };
    };

/**
 * Document status response
 */
export interface SessionDocumentStatus {
  sessionId: string;
  status: "pending" | "processing" | "completed" | "failed";
  filename?: string;
  size?: number;
  totalChunks?: number;
  processedChunks?: number;
  uploadedAt?: string;
  completedAt?: string;
  error?: string;
  hasDocument: boolean;
}

/**
 * Document delete response
 */
export interface SessionDocumentDeleteResponse {
  sessionId: string;
  deleted: boolean;
  message: string;
}

export class DocumentsApiClient extends BaseApiClient {
  protected readonly path = "/v1/sessions";

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  /**
   * Upload a document for analysis in a specific session
   *
   * @param sessionId - The chat session ID
   * @param file - The PDF file to upload
   * @param onEvent - Callback for SSE events (progress, completed, error)
   * @param signal - AbortSignal for cancellation
   */
  public async uploadDocument(
    sessionId: string,
    file: File,
    onEvent: (event: SessionDocumentEvent) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
    const token = getClientToken();

    const response = await fetch(
      `${baseURL}${this.path}/${sessionId}/document`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        credentials: "include",
        signal,
      },
    );

    if (!response.ok) {
      return handleSSEFetchError(
        response,
        `Upload failed with status ${response.status}`,
      );
    }

    await consumeSSEStream<SessionDocumentEvent>(response, onEvent, signal);
  }

  /**
   * Get the status of a document for a session
   *
   * @param sessionId - The chat session ID
   * @returns Document status with metadata
   */
  public async getDocumentStatus(
    sessionId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<SessionDocumentStatus> {
    const response = await this.api.request<{ data: SessionDocumentStatus }>(
      `${this.path}/${sessionId}/document`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return response.data;
  }

  /**
   * Delete a document for a session
   *
   * @param sessionId - The chat session ID
   * @returns Delete response
   */
  public async deleteDocument(
    sessionId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<SessionDocumentDeleteResponse> {
    const response = await this.api.request<{
      data: SessionDocumentDeleteResponse;
    }>(`${this.path}/${sessionId}/document`, {
      method: "DELETE",
      headers: { ...this.defaultHeaders, ...options.headers },
    });
    return response.data;
  }
}

let _documentsApi: DocumentsApiClient | null = null;
export const documentsApi = new Proxy({} as DocumentsApiClient, {
  get(_, prop) {
    if (!_documentsApi) _documentsApi = new DocumentsApiClient();
    return _documentsApi[prop as keyof DocumentsApiClient];
  },
});
