import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiCollection } from "../api/api.types";
import { BaseApiClient } from "../api";
import { CLIENTS_API_ROUTES } from "../api.routes";
import type { components } from "../generated/api.types";

/*
 * Types — Clients
 *
 * Clients are users (reused `user` JSON:API resource type). The backend
 * serializes clients as `user`, so we reuse the generated User schemas.
 */
export type Client = components["schemas"]["User"];
export type ClientCollectionResponse =
  components["schemas"]["UserCollectionResponse"];

export type ClientsMetadata = ClientCollectionResponse["metadata"];
export type ClientCollection = ApiCollection<Client, ClientsMetadata>;

export interface ClientListParams {
  lawyerUserId?: string;
  page?: number;
  limit?: number;
}

export class ClientsApiClient extends BaseApiClient {
  protected readonly path = CLIENTS_API_ROUTES.ROOT;

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async getClients(
    params: ClientListParams = {},
    options: { headers?: Record<string, string> } = {},
  ): Promise<ClientCollection> {
    const response = await this.api.request<ClientCollectionResponse>(
      this.path,
      {
        params,
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackCollection(response, {
      errMsg: "Invalid clients data received from the server",
    });
  }
}

let _clientsApi: ClientsApiClient | null = null;
export const clientsApi = new Proxy({} as ClientsApiClient, {
  get(_, prop) {
    if (!_clientsApi) _clientsApi = new ClientsApiClient();
    return _clientsApi[prop as keyof ClientsApiClient];
  },
});
