import { FetchApiClient } from "../fetch";
import type { components } from "../generated/api.types";
import { LAWYERS_API_ROUTES } from "../api.routes";

export type Lawyer = components["schemas"]["Lawyer"];
export type LawyerResource = components["schemas"]["LawyerResource"];
export type LawyerSingleResponse =
  components["schemas"]["LawyerSingleResponse"];
export type LawyersCollectionResponse =
  components["schemas"]["LawyersCollectionResponse"];
export type CreateLawyerRequest = components["schemas"]["CreateLawyer"];

export class LawyersApiClient {
  private api: FetchApiClient;
  constructor() {
    this.api = new FetchApiClient();
  }

  // Get all lawyers with optional filtering
  public async getLawyers(filters?: {
    specialization?: string;
    location?: string;
    available?: boolean;
    q?: string;
  }): Promise<Lawyer[]> {
    try {
      let url = LAWYERS_API_ROUTES.ROOT;
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
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await this.api.request<LawyersCollectionResponse>(url);
      if (!response.data) {
        console.error("Invalid lawyers data:", response);
        throw new Error("Invalid lawyers data received from the server");
      }
      const lawyers = response.data.map((resource) => resource.attributes);
      return lawyers;
    } catch (error) {
      console.error("Failed to fetch lawyers:", error);
      throw error;
    }
  }

  public async getLawyerById(lawyerId: string): Promise<Lawyer> {
    try {
      const response = await this.api.request<LawyerSingleResponse>(
        LAWYERS_API_ROUTES.ROOT + `/${lawyerId}`,
      );

      if (!response.data.attributes) {
        console.error("Invalid lawyer data:", response);
        throw new Error("Invalid lawyer data received from the server");
      }

      return response.data.attributes;
    } catch (error) {
      console.error("Failed to fetch lawyer:", error);
      throw error;
    }
  }

  public async createLawyer(lawyerData: CreateLawyerRequest): Promise<Lawyer> {
    try {
      const response = await this.api.request<LawyerSingleResponse>(
        LAWYERS_API_ROUTES.ROOT,
        {
          method: "POST",
          body: JSON.stringify(lawyerData),
        },
      );

      if (!response.data.attributes) {
        console.error("Invalid lawyer data:", response);
        throw new Error("Invalid lawyer data received from the server");
      }
      return response.data.attributes;
    } catch (error) {
      console.error("Failed to create lawyer:", error);
      throw error;
    }
  }

  // public async updateLawyer(
  //   lawyerId: string,
  //   updateData: UpdateLawyerRequest,
  //   options: { headers: HeadersInit } = { headers: {} },
  // ): Promise<Lawyer> {
  //   try {
  //     const response = await this.api.request<LawyerSingleResponse>(`/v1/lawyers/${lawyerId}`, {
  //       method: 'PUT',
  //       headers: options.headers,
  //       body: JSON.stringify(updateData),
  //     });

  //     if (!response.data.attributes) {
  //       console.error("Invalid lawyer data:", response);
  //       throw new Error("Invalid lawyer data received from the server");
  //     }
  //     return response.data.attributes;
  //   } catch (error) {
  //     console.error("Failed to update lawyer:", error);
  //     throw error;
  //   }
  // }

  public async getLawyerByEmail(email: string): Promise<Lawyer> {
    try {
      const response = await this.api.request<LawyerSingleResponse>(
        LAWYERS_API_ROUTES.ROOT + `/email?email=${encodeURIComponent(email)}`,
      );

      if (!response.data.attributes) {
        console.error("Invalid lawyer data:", response);
        throw new Error("Invalid lawyer data received from the server");
      }

      return response.data.attributes;
    } catch (error) {
      console.error("Failed to fetch lawyer:", error);
      throw error;
    }
  }
}

export const lawyersApi = new LawyersApiClient();
