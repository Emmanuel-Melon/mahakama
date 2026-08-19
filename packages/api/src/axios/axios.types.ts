import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

export type RequestInterceptor = (
  config: InternalAxiosRequestConfig,
) => Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig;

export type ResponseInterceptor = (
  response: AxiosResponse,
) => Promise<AxiosResponse> | AxiosResponse;

declare module "axios" {
  export interface AxiosRequestConfig {
    _isRetry?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    _isRetry?: boolean;
  }
}

export interface InterceptorContext {
  outboundCookies: string[];
  getSsrCookies: () => string | null;
  attemptRefresh: () => Promise<void>;
  request: <T>(endpoint: string, options?: AxiosRequestConfig) => Promise<T>;
}
