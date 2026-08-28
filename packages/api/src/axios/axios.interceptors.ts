import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getApiConfig } from "../api/api.config";
import { ApiClientError } from "../api/api.errors";
import type { InterceptorContext } from "./axios.types";
import {
  mergeCookieHeader,
  parseSetCookiesToCookieHeader,
} from "./axios.utils";
import {
  createRefreshFailedError,
  createSessionExpiredError,
} from "./axios.errors";

/**
 * Request interceptor: injects the latest SSR cookies before every request.
 */
export function createSsrCookieRequestHandler(context: InterceptorContext) {
  return (config: InternalAxiosRequestConfig) => {
    if (typeof window === "undefined") {
      const cookies = context.getSsrCookies();
      if (cookies) {
        if (config.headers.set) {
          config.headers.set("Cookie", cookies);
        } else {
          config.headers["Cookie"] = cookies;
        }
      }
    }
    return config;
  };
}

/**
 * Response interceptor: collects Set-Cookie headers during SSR.
 */
export function createSsrCookieSyncHandler(context: InterceptorContext) {
  return (response: AxiosResponse) => {
    if (typeof window === "undefined") {
      const raw = response.headers["set-cookie"];
      if (raw) {
        context.outboundCookies.push(...(Array.isArray(raw) ? raw : [raw]));
      }
    }
    return response;
  };
}

/**
 * Response error interceptor: handles 401 refresh + error normalization.
 */
export function createResponseErrorHandler(context: InterceptorContext) {
  const { refreshEndpoint } = getApiConfig();

  return async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;

    const status = error.response?.status;
    const config = error.config as InternalAxiosRequestConfig;
    const endpoint = config?.url ?? "";

    // 1. Refresh endpoint itself failed
    if (status === 401 && endpoint === refreshEndpoint) {
      throw createRefreshFailedError();
    }

    // 2. Auto-refresh on 401
    if (status === 401 && !config?._isRetry && endpoint !== refreshEndpoint) {
      config._isRetry = true;
      try {
        await context.attemptRefresh();

        if (
          typeof window === "undefined" &&
          context.outboundCookies.length > 0
        ) {
          const merged = mergeCookieHeader(
            config.headers.get?.("Cookie") ?? config.headers.Cookie,
            context.outboundCookies,
          );
          if (config.headers.set) {
            config.headers.set("Cookie", merged);
          } else {
            config.headers["Cookie"] = merged;
          }
          context.outboundCookies.length = 0;
        }

        return await context.request(endpoint, config);
      } catch (refreshError) {
        if (refreshError instanceof ApiClientError) throw refreshError;
        throw createSessionExpiredError();
      }
    }

    const errors = error.response?.data?.errors ?? [];
    if ((!status || status >= 500) && typeof window !== "undefined") {
      // capture api error
    }

    if (status === undefined) {
      console.error("[api:network-error]", {
        url: config?.url,
        baseURL: config?.baseURL,
        message: error.message,
        code: error.code,
      });
    }

    throw new ApiClientError(status ?? 500, errors);
  };
}

export function registerCoreInterceptors(
  instance: AxiosInstance,
  context: InterceptorContext,
) {
  instance.interceptors.request.use(createSsrCookieRequestHandler(context));

  instance.interceptors.response.use(createSsrCookieSyncHandler(context));

  instance.interceptors.response.use(
    (r) => r,
    createResponseErrorHandler(context),
  );
}
