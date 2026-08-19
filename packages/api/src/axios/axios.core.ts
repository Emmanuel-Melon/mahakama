import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { getApiConfig } from "../api/api.config";
import { AxiosApiClient } from "./index";
import { parseSetCookiesToCookieHeader } from "./axios.utils";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
let refreshedSsrCookies: string | null = null;

export async function performRefresh(client: AxiosApiClient): Promise<void> {
  if (typeof window !== "undefined") {
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = doRefresh(client).finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

    return refreshPromise;
  }

  if (client.isRefreshing && client.refreshPromise) {
    return client.refreshPromise;
  }

  client.isRefreshing = true;
  client.refreshPromise = doRefresh(client).finally(() => {
    client.isRefreshing = false;
    client.refreshPromise = null;
  });

  return client.refreshPromise;
}

async function doRefresh(client: AxiosApiClient): Promise<void> {
  const { refreshEndpoint } = getApiConfig();
  const cookies = client.context.getSsrCookies();

  try {
    await client.request<void>(refreshEndpoint, {
      method: "POST",
      headers: cookies ? { Cookie: cookies } : {},
    });

    if (typeof window === "undefined" && client.outboundCookies.length > 0) {
      refreshedSsrCookies = parseSetCookiesToCookieHeader(
        client.outboundCookies,
      );
      client.outboundCookies.length = 0;
      syncSsrCookies(client);
    }
  } catch (error) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("auth:session-expired", {
          detail: { reason: "refresh_failed", error },
        }),
      );
    }
    throw error;
  }
}

function syncSsrCookies(client: AxiosApiClient) {
  if (typeof window !== "undefined" || !refreshedSsrCookies) return;

  client.instance.defaults.headers["Cookie"] = refreshedSsrCookies;
  client.context.getSsrCookies = () => refreshedSsrCookies;
}

export async function executeRequest<T>(
  instance: AxiosInstance,
  url: string,
  opts: AxiosRequestConfig,
): Promise<T> {
  const response = await instance.request<T>({
    url,
    method: opts.method ?? "GET",
    ...opts,
  });
  return response.status === 204 ? (undefined as T) : response.data;
}
