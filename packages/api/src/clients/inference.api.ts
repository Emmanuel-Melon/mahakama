import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import type { components } from "../generated/api.types";

export type InferencePreference = components["schemas"]["InferencePreference"];
export type InferencePreferenceResource =
  components["schemas"]["InferencePreferenceResource"];
export type InferencePreferenceSingleResponse =
  components["schemas"]["InferencePreferenceSingleResponse"];
export type InferencePreferenceCollectionResponse =
  components["schemas"]["InferencePreferenceCollectionResponse"];
export type CreateUserRequest = components["schemas"]["CreateUser"];
export type Provider = components["schemas"]["Provider"];
export type ProviderResource = components["schemas"]["ProviderResource"];
export type ProviderCollectionResponse =
  components["schemas"]["ProviderCollectionResponse"];
export type Strategy = components["schemas"]["Strategy"];
export type StrategyResource = components["schemas"]["StrategyResource"];
export type StrategyCollectionResponse =
  components["schemas"]["StrategyCollectionResponse"];

export type InferencePreferenceMetadata =
  InferencePreferenceSingleResponse["metadata"];
export type InferencePreferenceResult = ApiResource<
  InferencePreference,
  InferencePreferenceMetadata
>;

export class InferenceApiClient extends BaseApiClient {
  protected readonly path = "/inference";

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  // Preferences routes
  public async getPreferences(
    userId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<InferencePreference[]> {
    const response =
      await this.api.request<InferencePreferenceCollectionResponse>(
        `${this.path}/preferences/${userId}`,
        {
          headers: { ...this.defaultHeaders, ...options.headers },
        },
      );
    return this.unpackCollection(response, {
      errMsg: "Invalid preferences data received from the server",
    });
  }

  public async getPreference(
    userId: string,
    strategyKey: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<InferencePreferenceResult> {
    const response = await this.api.request<InferencePreferenceSingleResponse>(
      `${this.path}/preferences/${userId}/${strategyKey}`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid preference data received from the server",
    });
  }

  public async upsertPreference(
    userId: string,
    strategyKey: string,
    data: Partial<InferencePreference>,
    options: { headers?: Record<string, string> } = {},
  ): Promise<InferencePreferenceResult> {
    const response = await this.api.request<InferencePreferenceSingleResponse>(
      `${this.path}/preferences/${userId}/${strategyKey}`,
      {
        method: "PUT",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid preference data received from the server",
    });
  }

  public async disablePreference(
    userId: string,
    strategyKey: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<InferencePreferenceResult> {
    const response = await this.api.request<InferencePreferenceSingleResponse>(
      `${this.path}/preferences/${userId}/${strategyKey}`,
      {
        method: "PUT",
        headers: { ...this.defaultHeaders, ...options.headers },
        data: { disabled: true },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid preference data received from the server",
    });
  }

  // Discovery routes
  public async getProviders(
    options: { headers?: Record<string, string> } = {},
  ): Promise<Provider[]> {
    const response = await this.api.request<ProviderCollectionResponse>(
      `${this.path}/providers`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackCollection(response, {
      errMsg: "Invalid providers data received from the server",
    });
  }

  public async getStrategies(
    options: { headers?: Record<string, string> } = {},
  ): Promise<Strategy[]> {
    const response = await this.api.request<StrategyCollectionResponse>(
      `${this.path}/strategies`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackCollection(response, {
      errMsg: "Invalid strategies data received from the server",
    });
  }
}

let _inferenceApi: InferenceApiClient | null = null;
export const inferenceApi = new Proxy({} as InferenceApiClient, {
  get(_, prop) {
    if (!_inferenceApi) _inferenceApi = new InferenceApiClient();
    return _inferenceApi[prop as keyof InferenceApiClient];
  },
});
