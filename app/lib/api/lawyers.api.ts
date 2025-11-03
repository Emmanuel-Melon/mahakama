import { fetchApi } from "./fetch";
import type { components } from "./types/api";
import { API_CONFIG } from "~/config";

export type Lawyer = components["schemas"]["Lawyer"];
export type CreateLawyerRequest = components["schemas"]["CreateLawyerRequest"];
export type UpdateLawyerRequest = components["schemas"]["UpdateLawyerRequest"];

type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  metadata: {
    status: {
      statusCode: number;
      defaultMessage: string;
      code: string;
    };
    requestId: string;
  };
};

type LawyersResponse = {
  lawyers: Lawyer[];
};

export class LawyersApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(apiKey?: string) {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    };
  }

  // Get all lawyers with optional filtering
  public async getLawyers(
    params?: {
      specialization?: string;
      minExperience?: number;
      language?: string;
    },
    options: RequestInit = {},
  ): Promise<Lawyer[]> {
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

    const result = await fetchApi.request<ApiResponse<LawyersResponse>>(
      endpoint,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      },
    );

    if (!result.success || !result.data?.lawyers) {
      throw new Error(result.message || "Failed to fetch lawyers");
    }

    return result.data.lawyers;
  }

  public async getLawyerById(
    lawyerId: string,
    options: RequestInit = {},
  ): Promise<Lawyer> {
    const result = await fetchApi.request<ApiResponse<{ lawyer: Lawyer }>>(
      `/v1/lawyers/${lawyerId}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      },
    );

    console.log("result", result);

    if (!result.success || !result.data?.lawyer) {
      throw new Error(result.message || "Lawyer not found");
    }

    return result.data.lawyer;
  }

  public async createLawyer(
    lawyerData: CreateLawyerRequest,
    options: RequestInit = {},
  ): Promise<Lawyer> {
    const result = await fetchApi.request<ApiResponse<{ lawyer: Lawyer }>>(
      "/v1/lawyers",
      {
        ...options,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(lawyerData),
      },
    );

    if (!result.success || !result.data?.lawyer) {
      throw new Error(result.message || "Failed to create lawyer");
    }
    return result.data.lawyer;
  }

  public async updateLawyer(
    lawyerId: string,
    updateData: UpdateLawyerRequest,
    options: RequestInit = {},
  ): Promise<Lawyer> {
    const result = await fetchApi.request<ApiResponse<{ lawyer: Lawyer }>>(
      `/v1/lawyers/${lawyerId}`,
      {
        ...options,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(updateData),
      },
    );

    if (!result.success || !result.data?.lawyer) {
      throw new Error(result.message || "Failed to update lawyer");
    }
    return result.data.lawyer;
  }

  public async getLawyerByEmail(
    email: string,
    options: RequestInit = {},
  ): Promise<Lawyer> {
    const result = await fetchApi.request<ApiResponse<{ lawyer: Lawyer }>>(
      `/v1/lawyers/email?email=${encodeURIComponent(email)}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      },
    );

    if (!result.success || !result.data?.lawyer) {
      throw new Error(result.message || "Lawyer not found");
    }

    return result.data.lawyer;
  }
}

export const lawyersApi = new LawyersApiClient();
