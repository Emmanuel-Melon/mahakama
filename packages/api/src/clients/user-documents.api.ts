// src/api/user-documents.api.ts
import { createApiClient, AxiosApiClient } from "../axios";
import { BaseApiClient } from "../api";
import {
  getClientToken,
  consumeSSEStream,
  handleSSEFetchError,
} from "../api/api.sse";

/**
 * User document upload event types (SSE)
 */
export type UserDocumentEvent =
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
 * User document status response
 */
export interface UserDocumentStatus {
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
 * User document delete response
 */
export interface UserDocumentDeleteResponse {
  sessionId: string;
  deleted: boolean;
  message: string;
}

export class UserDocumentsApiClient extends BaseApiClient {
  protected readonly path = "/v1/sessions";

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  /**
   * Upload a user document for analysis in a specific session
   *
   * @param sessionId - The chat session ID
   * @param file - The PDF file to upload
   * @param onEvent - Callback for SSE events (progress, completed, error)
   * @param signal - AbortSignal for cancellation
   */
  public async uploadUserDocument(
    sessionId: string,
    file: File,
    onEvent: (event: UserDocumentEvent) => void,
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

    await consumeSSEStream<UserDocumentEvent>(response, onEvent, signal);
  }

  /**
   * Get the status of a user document for a session
   *
   * @param sessionId - The chat session ID
   * @returns Document status with metadata
   */
  public async getUserDocumentStatus(
    sessionId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<UserDocumentStatus> {
    const response = await this.api.request<{ data: UserDocumentStatus }>(
      `${this.path}/${sessionId}/document`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return response.data;
  }

  /**
   * Delete a user document for a session
   *
   * @param sessionId - The chat session ID
   * @returns Delete response
   */
  public async deleteUserDocument(
    sessionId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<UserDocumentDeleteResponse> {
    const response = await this.api.request<{
      data: UserDocumentDeleteResponse;
    }>(`${this.path}/${sessionId}/document`, {
      method: "DELETE",
      headers: { ...this.defaultHeaders, ...options.headers },
    });
    return response.data;
  }
}

let _userDocumentsApi: UserDocumentsApiClient | null = null;
export const userDocumentsApi = new Proxy({} as UserDocumentsApiClient, {
  get(_, prop) {
    if (!_userDocumentsApi) _userDocumentsApi = new UserDocumentsApiClient();
    return _userDocumentsApi[prop as keyof UserDocumentsApiClient];
  },
});
