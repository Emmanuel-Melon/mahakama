import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { registerCoreInterceptors } from "./axios.interceptors";
import { performRefresh, executeRequest } from "./axios.core";
import { createBaseConfig } from "./axios.utils";
import type { InterceptorContext } from "./axios.types";

export class AxiosApiClient {
  public instance: AxiosInstance;
  public outboundCookies: string[] = [];
  public context: InterceptorContext;
  public isRefreshing = false;
  public refreshPromise: Promise<void> | null = null;

  constructor(overrides: Partial<AxiosRequestConfig> = {}) {
    this.instance = axios.create(createBaseConfig(overrides));
    this.context = this.buildContext();
    registerCoreInterceptors(this.instance, this.context);
  }

  private buildContext(): InterceptorContext {
    return {
      outboundCookies: this.outboundCookies,
      getSsrCookies: () => null,
      attemptRefresh: () => performRefresh(this),
      request: <T>(url: string, opts: any) =>
        executeRequest<T>(this.instance, url, opts),
    };
  }

  public async request<T>(url: string, options: AxiosRequestConfig = {}) {
    return executeRequest<T>(this.instance, url, options);
  }

  public setSsrCookieProvider(provider: () => string | null) {
    this.context.getSsrCookies = provider;
  }

  public getOutboundCookies(): string[] {
    return [...this.outboundCookies];
  }
}

export const createApiClient = (overrides?: Partial<AxiosRequestConfig>) =>
  new AxiosApiClient(overrides);
