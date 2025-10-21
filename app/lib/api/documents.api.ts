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

  public async getDocuments(options?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{
    data: LegalDocument[];
    meta: { total: number; limit: number; offset: number };
  }> {
    const params = new URLSearchParams();
    if (options?.limit) params.set("limit", options.limit.toString());
    if (options?.offset) params.set("offset", options.offset.toString());
    if (options?.search) params.set("search", options.search);

    const queryString = params.toString();
    const url = `/v1/documents${queryString ? `?${queryString}` : ""}`;

    const result = await this.api.request<DocumentsResponse>(url);
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
  ): Promise<LegalDocument> {
    const result = await this.api.request<ApiResponse<LegalDocument>>(
      `/v1/documents/${documentId}`,
    );

    console.log(result);

    if (!result.success || !result.data) {
      throw new Error("Document not found");
    }

    return result.data;
  }
}

export const documentsApi = new DocumentsApiClient();
