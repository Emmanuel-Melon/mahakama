import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiCollection, ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import type { components } from "../generated/api.types";

export type Consultation = components["schemas"]["Consultation"];
export type ConsultationResource =
  components["schemas"]["ConsultationResource"];
export type ConsultationSingleResponse =
  components["schemas"]["ConsultationSingleResponse"];
export type ConsultationsCollectionResponse =
  components["schemas"]["ConsultationCollectionResponse"];
export type NewConsultation = components["schemas"]["NewConsultation"];

export type ConsultationMetadata = ConsultationSingleResponse["metadata"];
export type ConsultationResult = ApiResource<
  Consultation,
  ConsultationMetadata
>;

export type ConsultationsMetadata = ConsultationsCollectionResponse["metadata"];
export type ConsultationsResult = ApiCollection<
  Consultation,
  ConsultationsMetadata
>;

export interface ConsultationListParams {
  status?: string;
  lawyerId?: string;
  lawyerUserId?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export interface DeclineConsultationPayload {
  declineReason: string;
}

export class ConsultationsApiClient extends BaseApiClient {
  protected readonly path = "/v1/consultations";

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async getConsultations(
    params: ConsultationListParams = {},
    options: { headers?: Record<string, string> } = {},
  ): Promise<ConsultationsResult> {
    const response = await this.api.request<ConsultationsCollectionResponse>(
      this.path,
      {
        params,
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackCollection(response, {
      errMsg: "Invalid consultations data received from the server",
    });
  }

  public async getConsultationById(
    consultationId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ConsultationResult> {
    const response = await this.api.request<ConsultationSingleResponse>(
      `${this.path}/${consultationId}`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid consultation data received from the server",
    });
  }

  public async requestConsultation(
    data: NewConsultation,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ConsultationResult> {
    const response = await this.api.request<ConsultationSingleResponse>(
      this.path,
      {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid consultation data received from the server",
    });
  }

  public async acceptConsultation(
    consultationId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ConsultationResult> {
    const response = await this.api.request<ConsultationSingleResponse>(
      `${this.path}/${consultationId}/accept`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid consultation data received from the server",
    });
  }

  public async declineConsultation(
    consultationId: string,
    data: DeclineConsultationPayload,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ConsultationResult> {
    const response = await this.api.request<ConsultationSingleResponse>(
      `${this.path}/${consultationId}/decline`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid consultation data received from the server",
    });
  }

  public async closeConsultation(
    consultationId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ConsultationResult> {
    const response = await this.api.request<ConsultationSingleResponse>(
      `${this.path}/${consultationId}/close`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid consultation data received from the server",
    });
  }
}

let _consultationsApi: ConsultationsApiClient | null = null;
export const consultationsApi = new Proxy({} as ConsultationsApiClient, {
  get(_, prop) {
    if (!_consultationsApi) _consultationsApi = new ConsultationsApiClient();
    return _consultationsApi[prop as keyof ConsultationsApiClient];
  },
});
