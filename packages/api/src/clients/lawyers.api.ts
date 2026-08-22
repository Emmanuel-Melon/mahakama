import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiCollection, ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import { LAWYERS_API_ROUTES } from "../api.routes";
import type { components } from "../generated/api.types";

export type Lawyer = components["schemas"]["Lawyer"];
export type LawyerResource = components["schemas"]["LawyerResource"];
export type LawyerSingleResponse =
  components["schemas"]["LawyerSingleResponse"];
export type LawyerCollectionResponse =
  components["schemas"]["LawyerCollectionResponse"];
export type CreateLawyerRequest = components["schemas"]["CreateLawyer"];

export type LawyerMetadata = LawyerSingleResponse["metadata"];
export type LawyerResult = ApiResource<Lawyer, LawyerMetadata>;
export type LawyerCollection = ApiCollection<
  Lawyer,
  LawyerCollectionResponse["metadata"]
>;

export class LawyersApiClient extends BaseApiClient {
  protected readonly path = LAWYERS_API_ROUTES.ROOT;

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  // Get all lawyers with optional filtering
  public async getLawyers(
    filters?: {
      specialization?: string;
      location?: string;
      available?: boolean;
      q?: string;
    },
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerCollection> {
    const searchParams = new URLSearchParams();

    if (filters) {
      if (filters.specialization) {
        searchParams.append("specialization", filters.specialization);
      }
      if (filters.location) {
        searchParams.append("location", filters.location);
      }
      if (filters.available !== undefined) {
        searchParams.append("available", filters.available.toString());
      }
      if (filters.q) {
        searchParams.append("q", filters.q);
      }
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${this.path}?${queryString}` : this.path;

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
    lawyerData: CreateLawyerRequest,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(this.path, {
      method: "POST",
      headers: { ...this.defaultHeaders, ...options.headers },
      data: lawyerData,
    });

    return this.unpackSingle(response, {
      errMsg: "Invalid lawyer data received from the server",
    });
  }

  public async getLawyerByEmail(
    email: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LawyerResult> {
    const response = await this.api.request<LawyerSingleResponse>(
      `${this.path}/email?email=${encodeURIComponent(email)}`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Invalid lawyer data received from the server",
    });
  }
}

let _lawyersApi: LawyersApiClient | null = null;
export const lawyersApi = new Proxy({} as LawyersApiClient, {
  get(_, prop) {
    if (!_lawyersApi) _lawyersApi = new LawyersApiClient();
    return _lawyersApi[prop as keyof LawyersApiClient];
  },
});
