import { FetchApiClient, type ApiResponse } from "./fetch";
import type { LegalDocument } from "~/documents/types.documents";

interface DocumentsResponse {
  data: LegalDocument[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export class DocumentsApiClient {
  private api: FetchApiClient;

  constructor(apiKey?: string) {
    this.api = new FetchApiClient({ apiKey });
  }

  public async getDocuments(
    params: {
      limit?: number;
      offset?: number;
      search?: string;
      [key: string]: any; // Allow additional query params
    } = {},
    options: {
      headers?: HeadersInit;
      token?: string;
    } = {},
  ) {
    const queryParams = new URLSearchParams();

    // Add standard params
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.offset) queryParams.set("offset", params.offset.toString());
    if (params.search) queryParams.set("search", params.search);

    // Add any additional params
    Object.entries(params).forEach(([key, value]) => {
      if (!["limit", "offset", "search"].includes(key) && value !== undefined) {
        queryParams.set(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = `/v1/documents${queryString ? `?${queryString}` : ""}`;

    // Prepare headers with auth token if provided
    const headers: HeadersInit = {
      ...(options.token && { Authorization: `Bearer ${options.token}` }),
      ...options.headers,
    };

    const result = await this.api.request<DocumentsResponse>(url, {
      headers,
    });

    if (!result) {
      throw new Error("Failed to fetch documents");
    }

    return {
      data: result.data || [],
      meta: result.meta || { total: 0, limit: 10, offset: 0 },
    };
  }
  public async getDocumentById(
    documentId: string | number,
    options?: {
      headers: HeadersInit;
    },
  ): Promise<LegalDocument> {
    const result = await this.api.request<ApiResponse<LegalDocument>>(
      `/v1/documents/${documentId}`,
      {
        headers: options?.headers,
      },
    );
    if (!result.success || !result.data) {
      throw new Error("Document not found");
    }

    return result.data;
  }
}

export const documentsApi = new DocumentsApiClient();
