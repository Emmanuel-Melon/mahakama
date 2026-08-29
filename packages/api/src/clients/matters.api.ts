import { createApiClient, AxiosApiClient } from "../axios";
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

export type MatterMetadata = MatterSingleResponse["metadata"];
export type MatterResult = ApiResource<Matter, MatterMetadata>;

export type MattersMetadata = MatterCollectionResponse["metadata"];
export type MattersResult = ApiCollection<Matter, MattersMetadata>;

export type MatterLawyerMetadata = MatterLawyerSingleResponse["metadata"];
export type MatterLawyerResult = ApiResource<
  MatterLawyer,
  MatterLawyerMetadata
>;

export type MatterNoteMetadata = MatterNoteSingleResponse["metadata"];
export type MatterNoteResult = ApiResource<MatterNote, MatterNoteMetadata>;

export type MatterTimelineEntry = {
  id: string;
  type: "status_history" | "event";
  timestamp: string;
  data: Record<string, unknown>;
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
      data: MatterTimelineEntry[];
      metadata?: { total?: number };
    }>(MATTERS_API_ROUTES.TIMELINE.replace(":matterId", matterId), {
      headers: { ...this.defaultHeaders, ...options.headers },
    });
    return response.data;
  }

  public async openMatter(
    data: NewMatter,
    options: { headers?: Record<string, string> } = {},
  ): Promise<MatterResult> {
    const response = await this.api.request<MatterSingleResponse>(
      this.path,
      {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
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
}

let _mattersApi: MattersApiClient | null = null;
export const mattersApi = new Proxy({} as MattersApiClient, {
  get(_, prop) {
    if (!_mattersApi) _mattersApi = new MattersApiClient();
    return _mattersApi[prop as keyof MattersApiClient];
  },
});
