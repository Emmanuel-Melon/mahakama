import { data } from "react-router";
import { AxiosApiClient } from "./index.js";
import { createBaseConfig } from "./axios.utils.js";
import { getAuthToken } from "../api/api.utils.js";

/**
 * Spawns an isolated client for a single server request thread.
 */
export function createIsolatedClient(request: Request): AxiosApiClient {
  const cookie = request.headers.get("Cookie") || "";
  const token = getAuthToken(request);

  const client = new AxiosApiClient(
    createBaseConfig({
      headers: {
        Cookie: cookie,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
  );

  client.setSsrCookieProvider(() => cookie);

  return client;
}

/**
 * Standard React Router Higher-Order function
 */
export async function withIsolatedAuth<T>(
  request: Request,
  callback: (client: AxiosApiClient) => Promise<T>,
) {
  const client = createIsolatedClient(request);
  const payload = await callback(client);

  const headers = new Headers();
  for (const cookie of client.getOutboundCookies()) {
    headers.append("Set-Cookie", cookie);
  }

  return data(payload, { headers });
}
