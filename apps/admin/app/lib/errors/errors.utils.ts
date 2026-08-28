import type { ComponentType } from "react";
import { ServerError } from "@mah/ui";
import { ERROR_MAP } from "./errors.config";
import { ERROR_COMPONENT_MAP } from "./errors.registry";
import type { ErrorComponentProps } from "./errors.types";

export function handleRouteError(error: unknown, context?: string): never {
  if (error instanceof Response) throw error;

  const err = error as any;
  const message = context ? `${context}: ` : "";

  if (err?.status === 401) {
    throw new Response(`${message}${ERROR_MAP[401].description}`, {
      status: 401,
    });
  }
  if (err?.status === 403) {
    throw new Response(`${message}${ERROR_MAP[403].description}`, {
      status: 403,
    });
  }
  if (err?.status === 404) {
    throw new Response(`${message}${ERROR_MAP[404].description}`, {
      status: 404,
    });
  }

  if (err?.name === "AbortError" || err?.code === "ETIMEDOUT") {
    throw new Response(`${message}Request timed out.`, { status: 408 });
  }

  // Check both, browser offline OR backend unreachable
  const isOffline =
    !globalThis.navigator?.onLine ||
    err instanceof TypeError ||
    err?.message === "Failed to fetch" ||
    err?.code === "ECONNREFUSED";

  if (isOffline) {
    throw new Response(`${message}${ERROR_MAP[503].description}`, {
      status: 503,
    });
  }

  throw new Response(`${message}${ERROR_MAP[500].description}`, {
    status: 500,
  });
}

export const getErrorComponent = (
  status?: number,
): ComponentType<ErrorComponentProps> => {
  return (status && ERROR_COMPONENT_MAP[status]) || ServerError;
};
