import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiCollection, ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import { LAWYERS_API_ROUTES } from "../api.routes";
import type { components } from "../generated/api.types";

/*
 * Types — Lawyers
 */
export type Lawyer = components["schemas"]["Lawyer"];
export type NewLawyer = components["schemas"]["NewLawyer"];
export type UpdateLawyer = components["schemas"]["UpdateLawyer"];
export type LawyerResource = components["schemas"]["LawyerResource"];
export type LawyerSingleResponse =
  components["schemas"]["LawyerSingleResponse"];
export type LawyerCollectionResponse =
  components["schemas"]["LawyerCollectionResponse"];

export type LawyerMetadata = LawyerSingleResponse["metadata"];
export type LawyerResult = ApiResource<Lawyer, LawyerMetadata>;
export type LawyerCollection = ApiCollection<
  Lawyer,
  LawyerCollectionResponse["metadata"]
>;

/*
 * Types — Lawyer Invites
 */
export type LawyerInvite = components["schemas"]["LawyerInvite"];
export type NewLawyerInvite = components["schemas"]["NewLawyerInvite"];
export type LawyerInviteResource =
  components["schemas"]["LawyerInviteResource"];
export type LawyerInviteSingleResponse =
  components["schemas"]["LawyerInviteSingleResponse"];
export type LawyerInviteCollectionResponse =
  components["schemas"]["LawyerInviteCollectionResponse"];

export type LawyerInviteMetadata = LawyerInviteSingleResponse["metadata"];
export type LawyerInviteResult = ApiResource<
  LawyerInvite,
  LawyerInviteMetadata
>;
export type LawyerInviteCollection = ApiCollection<
  LawyerInvite,
  LawyerInviteCollectionResponse["metadata"]
>;

/*
 * Types — Lawyer Profile Documents
 */
export type LawyerProfileDocument =
  components["schemas"]["LawyerProfileDocument"];
export type NewLawyerProfileDocument =
  components["schemas"]["NewLawyerProfileDocument"];
export type LawyerProfileDocumentResource =
  components["schemas"]["LawyerProfileDocumentResource"];
export type LawyerProfileDocumentSingleResponse =
  components["schemas"]["LawyerProfileDocumentSingleResponse"];
export type LawyerProfileDocumentCollectionResponse =
  components["schemas"]["LawyerProfileDocumentCollectionResponse"];

export type LawyerProfileDocumentMetadata =
  LawyerProfileDocumentSingleResponse["metadata"];
export type LawyerProfileDocumentResult = ApiResource<
  LawyerProfileDocument,
  LawyerProfileDocumentMetadata
>;
export type LawyerProfileDocumentCollection = ApiCollection<
  LawyerProfileDocument,
  LawyerProfileDocumentCollectionResponse["metadata"]
>;

/*
 * Types — Action requests
 */
export type RejectLawyerRequest = components["schemas"]["RejectLawyer"];
export type UpdateInviteStatusRequest =
  components["schemas"]["UpdateLawyerInvite"];

/*
 * API Client
 */
export class LawyersApiClient extends BaseApiClient {
  protected readonly path = LAWYERS_API_ROUTES.ROOT;

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  /*
   * PUBLIC — Directory
   */

  public async getDirectory(
    filters?: {
      specialization?: string;
      location?: string;
      q?: string;
    },
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerCollection> {
    const searchParams = this.buildFilterParams(filters);
    const url = searchParams
      ? `${LAWYERS_API_ROUTES.DIRECTORY}?${searchParams}`
      : LAWYERS_API_ROUTES.DIRECTORY;

    const response = await this.api.request<LawyerCollectionResponse>(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
    });

    return this.unpackCollection(response, {
      errMsg: "Invalid lawyer directory data received from the server",
    });
  }

  /*
   * LAWYER — Profile
   */

  public async getProfile(
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(
      LAWYERS_API_ROUTES.PROFILE,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Invalid lawyer profile data received from the server",
    });
  }

  public async createProfile(
    data: NewLawyer,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(
      LAWYERS_API_ROUTES.PROFILE,
      {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Invalid lawyer profile data received from the server",
    });
  }

  public async updateProfile(
    data: UpdateLawyer,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(
      LAWYERS_API_ROUTES.PROFILE,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Invalid lawyer profile data received from the server",
    });
  }

  public async submitProfile(
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(
      LAWYERS_API_ROUTES.PROFILE_SUBMIT,
      {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Failed to submit lawyer profile",
    });
  }

  /*
   * LAWYER — Documents
   */

  public async uploadDocument(
    data: NewLawyerProfileDocument,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerProfileDocumentResult> {
    const response =
      await this.api.request<LawyerProfileDocumentSingleResponse>(
        LAWYERS_API_ROUTES.PROFILE_DOCUMENTS,
        {
          method: "POST",
          headers: { ...this.defaultHeaders, ...options.headers },
          data,
        },
      );

    return this.unpackSingle(response, {
      errMsg: "Failed to upload document",
    });
  }

  public async deleteDocument(
    documentId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<void> {
    await this.api.request(
      `${LAWYERS_API_ROUTES.PROFILE_DOCUMENTS}/${documentId}`,
      {
        method: "DELETE",
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
  }

  /*
   * ADMIN — Lawyer management
   */

  public async getLawyers(
    filters?: {
      specialization?: string;
      location?: string;
      status?: string;
      q?: string;
    },
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerCollection> {
    const searchParams = this.buildFilterParams(filters);
    const url = searchParams ? `${this.path}?${searchParams}` : this.path;

    const response = await this.api.request<LawyerCollectionResponse>(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
    });

    return this.unpackCollection(response, {
      errMsg: "Invalid lawyers data received from the server",
    });
  }

  public async getLawyerById(
    lawyerId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(
      `${this.path}/${lawyerId}`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Invalid lawyer data received from the server",
    });
  }

  public async createLawyer(
    data: NewLawyer,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(this.path, {
      method: "POST",
      headers: { ...this.defaultHeaders, ...options.headers },
      data,
    });

    return this.unpackSingle(response, {
      errMsg: "Invalid lawyer data received from the server",
    });
  }

  public async updateLawyer(
    lawyerId: string,
    data: UpdateLawyer,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(
      `${this.path}/${lawyerId}`,
      {
        method: "PUT",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Invalid lawyer data received from the server",
    });
  }

  public async approveLawyer(
    lawyerId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(
      `${this.path}/${lawyerId}/approve`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Failed to approve lawyer",
    });
  }

  public async rejectLawyer(
    lawyerId: string,
    data: RejectLawyerRequest,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(
      `${this.path}/${lawyerId}/reject`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Failed to reject lawyer",
    });
  }

  /*
   * ADMIN — Invites
   */

  public async getInvites(
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerInviteCollection> {
    const response = await this.api.request<LawyerInviteCollectionResponse>(
      LAWYERS_API_ROUTES.INVITES,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackCollection(response, {
      errMsg: "Invalid invites data received from the server",
    });
  }

  public async createInvite(
    data: NewLawyerInvite,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerInviteResult> {
    const response = await this.api.request<LawyerInviteSingleResponse>(
      LAWYERS_API_ROUTES.INVITES,
      {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Failed to create invite",
    });
  }

  public async updateInvite(
    inviteId: string,
    data: UpdateInviteStatusRequest,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerInviteResult> {
    const response = await this.api.request<LawyerInviteSingleResponse>(
      `${LAWYERS_API_ROUTES.INVITES}/${inviteId}`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Failed to update invite",
    });
  }

  /*
   * Helpers
   */

  private buildFilterParams(
    filters?: Record<string, string | boolean | undefined>,
  ): string | null {
    if (!filters) return null;

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    }
    return searchParams.toString() || null;
  }
}

let _lawyersApi: LawyersApiClient | null = null;
export const lawyersApi = new Proxy({} as LawyersApiClient, {
  get(_, prop) {
    if (!_lawyersApi) _lawyersApi = new LawyersApiClient();
    return _lawyersApi[prop as keyof LawyersApiClient];
  },
});
