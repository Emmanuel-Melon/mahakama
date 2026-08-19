import { ApiClientError } from "../api/api.errors";

export const createRefreshFailedError = () =>
  new ApiClientError(401, [
    {
      id: crypto.randomUUID(),
      status: "401",
      code: "REFRESH_TOKEN_INVALID",
      title: "Session Expired",
      detail: "Please log in again.",
      metadata: { timestamp: new Date().toISOString() },
    },
  ]);

export const createSessionExpiredError = () =>
  new ApiClientError(401, [
    {
      id: crypto.randomUUID(),
      status: "401",
      code: "SESSION_EXPIRED",
      title: "Session Expired",
      detail: "Please log in again.",
      metadata: { timestamp: new Date().toISOString() },
    },
  ]);
