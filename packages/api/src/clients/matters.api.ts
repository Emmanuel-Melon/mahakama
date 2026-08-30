import { createApiClient, AxiosApiClient } from "../axios";
import { getClientToken } from "../api/api.sse";
import type { ApiCollection, ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import type { components } from "../generated/api.types";
import { MATTERS_API_ROUTES } from "../api.routes";

export type Matter = components["schemas"]["Matter"];
export type MatterResource = components["schemas"]["MatterResource"];
export type MatterSingleResponse =
  components["schemas"]["MatterSingleResponse"];
export type MatterCollectionResponse =
  components["schemas"]["MatterCollectionResponse"];
export type NewMatter = components["schemas"]["NewMatter"];
export type UpdateMatter = components["schemas"]["UpdateMatter"];

export type MatterLawyer = components["schemas"]["MatterLawyer"];
export type MatterLawyerResource =
  components["schemas"]["MatterLawyerResource"];
export type MatterLawyerSingleResponse =
  components["schemas"]["MatterLawyerSingleResponse"];
export type MatterLawyerCollectionResponse =
  components["schemas"]["MatterLawyerCollectionResponse"];
export type NewMatterLawyer = components["schemas"]["NewMatterLawyer"];
export type UpdateMatterLawyer = components["schemas"]["UpdateMatterLawyer"];

export type MatterNote = components["schemas"]["MatterNote"];
export type MatterNoteResource = components["schemas"]["MatterNoteResource"];
export type MatterNoteSingleResponse =
  components["schemas"]["MatterNoteSingleResponse"];
export type MatterNoteCollectionResponse =
  components["schemas"]["MatterNoteCollectionResponse"];
export type NewMatterNote = components["schemas"]["NewMatterNote"];
export type UpdateMatterNote = components["schemas"]["UpdateMatterNote"];

export type MatterDocument = components["schemas"]["MatterDocument"];
export type MatterDocumentResource =
  components["schemas"]["MatterDocumentResource"];
export type MatterDocumentSingleResponse =
  components["schemas"]["MatterDocumentSingleResponse"];
export type MatterDocumentCollectionResponse =
  components["schemas"]["MatterDocumentCollectionResponse"];

export type MatterMetadata = MatterSingleResponse["metadata"];
export type MatterResult = ApiResource<Matter, MatterMetadata>;

export type MattersMetadata = MatterCollectionResponse["metadata"];
export type MattersResult = ApiCollection<Matter, MattersMetadata>;

export type MatterLawyerMetadata = MatterLawyerSingleResponse["metadata"];
export type MatterLawyerResult = ApiResource<
  MatterLawyer,
  MatterLawyerMetadata
>;
export type MatterLawyerCollection = ApiCollection<
  MatterLawyer,
  MatterLawyerCollectionResponse["metadata"]
>;

export type MatterNoteMetadata = MatterNoteSingleResponse["metadata"];
export type MatterNoteResult = ApiResource<MatterNote, MatterNoteMetadata>;
export type MatterNoteCollection = ApiCollection<
  MatterNote,
  MatterNoteCollectionResponse["metadata"]
>;

export type MatterDocumentMetadata = MatterDocumentSingleResponse["metadata"];
export type MatterDocumentResult = ApiResource<
  MatterDocument,
  MatterDocumentMetadata
>;
export type MatterDocumentCollection = ApiCollection<
  MatterDocument,
  MatterDocumentCollectionResponse["metadata"]
>;

export type MatterDocumentAnalysis = {
  summary: string;
  documentType?: string;
  parties?: { name: string; role?: string }[];
  claims?: string[];
  requestedRelief?: string;
  keyDates?: { date: string; description: string }[];
  risks?: string[];
  applicableLaws?: string[];
  recommendations?: string[];
};

export type MatterDocumentWithAnalysis = MatterDocument & {
  analysis?: MatterDocumentAnalysis | null;
  analyzedAt?: string | null;
};
export type MatterDocumentWithAnalysisResult = ApiResource<
  MatterDocumentWithAnalysis,
  MatterDocumentMetadata
>;

export type MatterTimelineEntry = {
  id: string;
  source: "activity" | "status_history" | "event";
  type: string;
  title: string;
  description: string | null;
  actorUserId: string | null;
  timestamp: string;
  isInternal: boolean;
  data: Record<string, unknown>;
};

type MatterTimelineResource = {
  type: string;
  id: string;
  attributes: MatterTimelineEntry;
};

export interface MatterListParams {
  clientUserId?: string;
  lawyerUserId?: string;
  status?: string;
  jurisdiction?: string;
  practiceArea?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  q?: string;
}

export class MattersApiClient extends BaseApiClient {
  protected readonly path = MATTERS_API_ROUTES.ROOT;

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async getMatters(
    params: MatterListParams = {},
    options: { headers?: Record<string, string> } = {},
  ): Promise<MattersResult> {
    const response = await this.api.request<MatterCollectionResponse>(
      this.path,
      {
        params,
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackCollection(response, {
      errMsg: "Invalid matters data received from the server",
    });
  }

  public async getMatterById(
    matterId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterResult> {
    const response = await this.api.request<MatterSingleResponse>(
      `${this.path}/${matterId}`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid matter data received from the server",
    });
  }

  public async getMatterTimeline(
    matterId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterTimelineEntry[]> {
    const response = await this.api.request<{
      data: MatterTimelineResource[];
      metadata?: { total?: number };
    }>(MATTERS_API_ROUTES.TIMELINE.replace(":matterId", matterId), {
      headers: { ...this.defaultHeaders, ...options.headers },
    });
    return response.data.map((resource) => resource.attributes);
  }

  public async openMatter(
    data: NewMatter,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterResult> {
    const response = await this.api.request<MatterSingleResponse>(this.path, {
      method: "POST",
      headers: { ...this.defaultHeaders, ...options.headers },
      data,
    });
    return this.unpackSingle(response, {
      errMsg: "Invalid matter data received from the server",
    });
  }

  public async updateMatter(
    matterId: string,
    data: UpdateMatter,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterResult> {
    const response = await this.api.request<MatterSingleResponse>(
      `${this.path}/${matterId}`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid matter data received from the server",
    });
  }

  public async createMatterLawyer(
    matterId: string,
    data: NewMatterLawyer,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterLawyerResult> {
    const response = await this.api.request<MatterLawyerSingleResponse>(
      MATTERS_API_ROUTES.LAWYERS.replace(":matterId", matterId),
      {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid matter lawyer data received from the server",
    });
  }

  public async getMatterLawyers(
    matterId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterLawyerCollection> {
    const response = await this.api.request<MatterLawyerCollectionResponse>(
      MATTERS_API_ROUTES.LAWYERS.replace(":matterId", matterId),
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackCollection(response, {
      errMsg: "Invalid matter lawyers data received from the server",
    });
  }

  public async updateMatterLawyerMe(
    matterId: string,
    data: UpdateMatterLawyer,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterLawyerResult> {
    const response = await this.api.request<MatterLawyerSingleResponse>(
      MATTERS_API_ROUTES.LAWYERS_ME.replace(":matterId", matterId),
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid matter lawyer data received from the server",
    });
  }

  public async addMatterNote(
    matterId: string,
    data: NewMatterNote,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterNoteResult> {
    const response = await this.api.request<MatterNoteSingleResponse>(
      MATTERS_API_ROUTES.NOTES.replace(":matterId", matterId),
      {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid matter note data received from the server",
    });
  }

  public async getMatterNotes(
    matterId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterNoteCollection> {
    const response = await this.api.request<MatterNoteCollectionResponse>(
      MATTERS_API_ROUTES.NOTES.replace(":matterId", matterId),
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackCollection(response, {
      errMsg: "Invalid matter notes data received from the server",
    });
  }

  public async getMatterDocuments(
    matterId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterDocumentCollection> {
    const response = await this.api.request<MatterDocumentCollectionResponse>(
      MATTERS_API_ROUTES.DOCUMENTS.replace(":matterId", matterId),
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackCollection(response, {
      errMsg: "Invalid matter documents data received from the server",
    });
  }

  public async getMatterDocument(
    matterId: string,
    documentId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterDocumentWithAnalysisResult> {
    const response = await this.api.request<MatterDocumentSingleResponse>(
      MATTERS_API_ROUTES.DOCUMENT.replace(":matterId", matterId).replace(
        ":documentId",
        documentId,
      ),
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response as any, {
      errMsg: "Invalid matter document data received from the server",
    });
  }

  public async analyzeMatterDocument(
    matterId: string,
    documentId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterDocumentResult> {
    const response = await this.api.request<MatterDocumentSingleResponse>(
      MATTERS_API_ROUTES.ANALYZE.replace(":matterId", matterId).replace(
        ":documentId",
        documentId,
      ),
      {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid matter document data received from the server",
    });
  }

  public async uploadMatterDocument(
    matterId: string,
    file: File,
    description?: string,
    options: { headers?: Record<string, string>; signal?: AbortSignal } = {},
  ): Promise<MatterDocumentResult> {
    const formData = new FormData();
    formData.append("file", file);
    if (description) formData.append("description", description);

    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
    const token = getClientToken();

    const response = await fetch(
      `${baseURL}${MATTERS_API_ROUTES.DOCUMENTS.replace(":matterId", matterId)}`,
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
        body: formData,
        credentials: "include",
        signal: options.signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to upload matter document: ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as MatterDocumentSingleResponse;
    return this.unpackSingle(payload, {
      errMsg: "Invalid matter document data received from the server",
    });
  }
}

let _mattersApi: MattersApiClient | null = null;
export const mattersApi = new Proxy({} as MattersApiClient, {
  get(_, prop) {
    if (!_mattersApi) _mattersApi = new MattersApiClient();
    return _mattersApi[prop as keyof MattersApiClient];
  },
});
