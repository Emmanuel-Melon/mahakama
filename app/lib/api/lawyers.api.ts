import { FetchApiClient, type ApiResponse } from "./fetch";
import type { components } from "./types/api";

export type Lawyer = components["schemas"]["Lawyer"];
export type CreateLawyerRequest = components["schemas"]["CreateLawyerRequest"];
export type UpdateLawyerRequest = components["schemas"]["UpdateLawyerRequest"];

type GetLawyersResponse = ApiResponse<Lawyer[]>;
type GetLawyerByIdResponse = ApiResponse<Lawyer>;
type CreateLawyerResponse = ApiResponse<Lawyer>;
type UpdateLawyerResponse = ApiResponse<Lawyer>;

export class LawyersApiClient {
  private api: FetchApiClient;

  constructor(apiKey?: string) {
    this.api = new FetchApiClient({ apiKey });
  }

  // Get all lawyers with optional filtering
  public async getLawyers(params?: {
    specialization?: string;
    minExperience?: number;
    language?: string;
  }): Promise<Lawyer[]> {
    const queryParams = new URLSearchParams();

    if (params?.specialization) {
      queryParams.append("specialization", params.specialization);
    }
    if (params?.minExperience !== undefined) {
      queryParams.append("minExperience", params.minExperience.toString());
    }
    if (params?.language) {
      queryParams.append("language", params.language);
    }

    const queryString = queryParams.toString();
    const endpoint = `/v1/lawyers${queryString ? `?${queryString}` : ""}`;

    const result = await this.api.request<GetLawyersResponse>(endpoint);

    console.log("lawyers", result);
    if (!result.success || !result.data) {
      throw new Error("Failed to fetch lawyers");
    }

    return result.data;
  }

  public async getLawyerById(lawyerId: string): Promise<Lawyer> {
    const result = await this.api.request<GetLawyerByIdResponse>(
      `/v1/lawyers/${lawyerId}`,
    );

    if (!result.success || !result.data) {
      throw new Error("Lawyer not found");
    }

    // Ensure we have a valid lawyer object with required fields
    const lawyer = result?.data;

    // Set default values for required fields if they're missing
    return {
      ...lawyer,
    };
  }

  public async createLawyer(lawyerData: CreateLawyerRequest): Promise<Lawyer> {
    const result = await this.api.request<CreateLawyerResponse>("/v1/lawyers", {
      method: "POST",
      body: JSON.stringify(lawyerData),
    });

    if (!result.success || !result.data) {
      throw new Error("Failed to create lawyer");
    }
    return result.data;
  }

  public async updateLawyer(
    lawyerId: string,
    updateData: UpdateLawyerRequest,
  ): Promise<Lawyer> {
    const result = await this.api.request<UpdateLawyerResponse>(
      `/v1/lawyers/${lawyerId}`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      },
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to update lawyer");
    }
    return result.data;
  }

  public async getLawyerByEmail(email: string): Promise<Lawyer> {
    const result = await this.api.request<GetLawyerByIdResponse>(
      `/v1/lawyers/email?email=${encodeURIComponent(email)}`,
    );

    if (!result.success || !result.data) {
      throw new Error("Lawyer not found");
    }

    return result.data;
  }
}

export const lawyersApi = new LawyersApiClient();
