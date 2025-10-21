import { FetchApiClient, type ApiResponse } from './fetch';
import type { Lawyer } from '~/lawyers/lawyers.types';

export class LawyersApiClient {
  private api: FetchApiClient;

  constructor(apiKey?: string) {
    this.api = new FetchApiClient({ apiKey });
  }

  public async getLawyers(): Promise<Lawyer[]> {
    const result = await this.api.request<ApiResponse<Lawyer[]>>('/lawyers');

    if (!result.success || !result.data) {
      throw new Error('Failed to fetch lawyers');
    }

    return result.data;
  }

  public async getLawyerById(lawyerId: string | number): Promise<Lawyer> {
    const result = await this.api.request<ApiResponse<Lawyer>>(
      `/lawyers/${lawyerId}`
    );

    if (!result.success || !result.data) {
      throw new Error('Lawyer not found');
    }

    return result.data;
  }
}

export const lawyersApi = new LawyersApiClient();

