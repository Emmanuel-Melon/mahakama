import { ResponseConfig } from "@asteasolutions/zod-to-openapi";
import { z, ZodRawShape } from "zod";

import { HttpStatus } from "../http/http.status";
import type { StatusConfig } from "../http/http.types";
import { AnyZodObject } from "../zod";
import type { AvailableStatusCode, OpenApiResponses } from "./openapi.types";

export const ErrorResponseRef = {
  $ref: "#/components/schemas/JsonApiErrorResponse",
};

const StatusLookup = Object.values(HttpStatus).reduce<
  Record<number, StatusConfig>
>((acc, config) => {
  acc[config.statusCode] = config;
  return acc;
}, {});

export function buildResponse(
  status: StatusConfig,
  schema: z.ZodObject<ZodRawShape> | null = null,
): OpenApiResponses {
  const responseConfig: ResponseConfig = { description: status.description };

  if (schema) {
    responseConfig.content = {
      "application/json": { schema: schema as AnyZodObject },
    };
  }

  return { [String(status.statusCode)]: responseConfig };
}

export function buildErrorResponse(
  codes: AvailableStatusCode[] = [401, 403],
): OpenApiResponses {
  return codes.reduce<OpenApiResponses>((acc, code) => {
    const status = StatusLookup[code];
    if (status) {
      acc[code] = {
        description: status.description,
        content: { "application/json": { schema: ErrorResponseRef } },
      };
    }
    return acc;
  }, {});
}
