import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import type { components } from "../generated/api.types";

export type LegalService = components["schemas"]["LegalService"];
export type LegalServiceResource =
  components["schemas"]["LegalServiceResource"];
export type LegalServiceSingleResponse =
  components["schemas"]["LegalServiceSingleResponse"];
export type LegalServicesCollectionResponse =
  components["schemas"]["LegalServiceCollectionResponse"];
export type CategoryLabels = components["schemas"]["CategoryLabels"];
export type ServiceCategory = components["schemas"]["ServiceCategory"];

export type LegalServiceMetadata = LegalServiceSingleResponse["metadata"];
export type LegalServiceResult = ApiResource<
  LegalService,
  LegalServiceMetadata
>;

export class ServicesApiClient extends BaseApiClient {
  protected readonly path = "/v1/services";

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async getServices(
    category?:
      "government" | "legal-aid" | "dispute-resolution" | "specialized",
    options: { headers?: Record<string, string> } = {},
  ): Promise<LegalService[]> {
    let url = this.path;

    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    const response = await this.api.request<LegalServicesCollectionResponse>(
      url,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackCollection(response, {
      errMsg: "Invalid services data received from the server",
    });
  }

  public async getServiceById(
    serviceId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<LegalServiceResult> {
    const response = await this.api.request<LegalServiceSingleResponse>(
      `${this.path}/${serviceId}`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Invalid service data received from the server",
    });
  }
}

let _servicesApi: ServicesApiClient | null = null;
export const servicesApi = new Proxy({} as ServicesApiClient, {
  get(_, prop) {
    if (!_servicesApi) _servicesApi = new ServicesApiClient();
    return _servicesApi[prop as keyof ServicesApiClient];
  },
});
