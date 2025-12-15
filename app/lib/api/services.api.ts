import { FetchApiClient } from "./fetch";
import type { components } from "./generated/api.types";

export type LegalService = components["schemas"]["LegalService"];
export type LegalServiceResource = components["schemas"]["LegalServiceResource"];
export type LegalServiceSingleResponse = components["schemas"]["LegalServiceSingleResponse"];
export type LegalServicesCollectionResponse = components["schemas"]["LegalServicesCollectionResponse"];
export type CategoryLabels = components["schemas"]["CategoryLabels"];
export type ServiceCategory = components["schemas"]["ServiceCategory"];

export class ServicesApiClient {
  private api: FetchApiClient;
  constructor() {
    this.api = new FetchApiClient();
  }

  public async getServices(
    options: { headers: HeadersInit; category?: "government" | "legal-aid" | "dispute-resolution" | "specialized" } = { headers: {} },
  ): Promise<LegalService[]> {
    try {
      let url = "/v1/services";

      if (options.category) {
        url += `?category=${encodeURIComponent(options.category)}`;
      }

      const response = await this.api.request<LegalServicesCollectionResponse>(url, {
        headers: options.headers,
      });
      
      if (!response.data) {
        console.error("Invalid services data:", response);
        throw new Error("Invalid services data received from the server");
      }
      
      const services = response.data.map((resource) => resource.attributes);
      return services;
    } catch (error) {
      console.error("Failed to fetch services:", error);
      throw error;
    }
  }

  public async getServiceById(
    serviceId: string,
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<LegalService> {
    try {
      const response = await this.api.request<LegalServiceSingleResponse>(`/v1/services/${serviceId}`, {
        headers: options.headers,
      });

      if (!response.data.attributes) {
        console.error("Invalid service data:", response);
        throw new Error("Invalid service data received from the server");
      }

      return response.data.attributes;
    } catch (error) {
      console.error("Failed to fetch service:", error);
      throw error;
    }
  }
}

export const servicesApi = new ServicesApiClient(); 