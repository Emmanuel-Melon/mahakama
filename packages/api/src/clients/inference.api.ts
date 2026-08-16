import { FetchApiClient } from "../fetch";
import type { components, paths } from "../generated/api.types";

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

export class InferenceApiClient {
  private api: FetchApiClient;

  constructor(apiClient?: FetchApiClient) {
    this.api = apiClient || new FetchApiClient();
  }

  // Preferences routes
  async getPreferences(userId: string): Promise<InferencePreference[]> {
    const response =
      await this.api.request<InferencePreferenceCollectionResponse>(
        `/inference/preferences/${userId}`,
      );
    if (!response.data) {
      throw new Error("Invalid preferences data received from the server");
    }
    return response.data.map((item) => item.attributes);
  }

  async getPreference(
    userId: string,
    strategyKey: string,
  ): Promise<InferencePreference> {
    const response = await this.api.request<InferencePreferenceSingleResponse>(
      `/inference/preferences/${userId}/${strategyKey}`,
    );
    if (!response.data.attributes) {
      throw new Error("Invalid preference data received from the server");
    }
    return response.data.attributes;
  }

  async upsertPreference(
    userId: string,
    strategyKey: string,
    data: Partial<InferencePreference>,
  ): Promise<InferencePreference> {
    const response = await this.api.request<InferencePreferenceSingleResponse>(
      `/inference/preferences/${userId}/${strategyKey}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    if (!response.data.attributes) {
      throw new Error("Invalid preference data received from the server");
    }
    return response.data.attributes;
  }

  async disablePreference(
    userId: string,
    strategyKey: string,
  ): Promise<InferencePreference> {
    const response = await this.api.request<InferencePreferenceSingleResponse>(
      `/inference/preferences/${userId}/${strategyKey}`,
      {
        method: "PUT",
        body: JSON.stringify({ disabled: true }),
      },
    );
    if (!response.data.attributes) {
      throw new Error("Invalid preference data received from the server");
    }
    return response.data.attributes;
  }

  // Discovery routes
  async getProviders(): Promise<Provider[]> {
    const response = await this.api.request<ProviderCollectionResponse>(
      "/inference/providers",
    );
    if (!response.data) {
      throw new Error("Invalid providers data received from the server");
    }
    return response.data.map((item) => item.attributes);
  }

  async getStrategies(): Promise<Strategy[]> {
    const response = await this.api.request<StrategyCollectionResponse>(
      "/inference/strategies",
    );
    if (!response.data) {
      throw new Error("Invalid strategies data received from the server");
    }
    return response.data.map((item) => item.attributes);
  }
}
