import { Request } from "express";
import {
  JsonApiResourceConfig,
  ResourceObject,
  ErrorResponseConfig,
  SerializedError,
  SerializedResponse,
  SerializeJsonApiOptions,
} from "./express.types";
import { type ResponseMetadata, type JsonApiError } from "./express.schema";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const serializeResource = <T>(
  resource: T & { id: string },
  config: JsonApiResourceConfig<T>,
  req: Request,
): ResourceObject<T> => {
  const {
    attributes,
    relationships,
    resourceMeta,
    type,
    links: configLinks,
  } = config;

  const serialized: ResourceObject<T> = {
    type,
    id: resource.id,
    attributes: attributes(resource),
  };

  if (relationships) {
    serialized.relationships = {};
    for (const [key, relConfig] of Object.entries(relationships)) {
      serialized.relationships[key] = {
        ...(relConfig.links && { links: relConfig.links(resource, req) }),
        ...(relConfig.data && { data: relConfig.data(resource) }),
      };
    }
  }

  if (resourceMeta) {
    serialized.meta = resourceMeta(resource);
  }

  if (configLinks) {
    serialized.links = configLinks(resource, req) as Record<string, string>;
  }

  return serialized;
};

export function serializeJsonApi<T>(
  req: Request,
  options: SerializeJsonApiOptions,
): SerializedResponse<ResourceObject<T>> {
  const { responseConfig, metadata: additionalMetadata = {} } = options;
  const { type, data, serializerConfig } = responseConfig;

  const serializedData =
    type === "collection"
      ? (data as (T & { id: string })[]).map((resource) =>
          serializeResource(resource, serializerConfig, req),
        )
      : serializeResource(data as T & { id: string }, serializerConfig, req);

  const responseMetadata: ResponseMetadata = {
    requestId: (req as any).requestId,
    timestamp: new Date().toISOString(),
    ...additionalMetadata,
  };

  return {
    data: serializedData,
    metadata: responseMetadata,
  };
}

export function serializeError(
  req: Request,
  errorConfig: ErrorResponseConfig,
  additionalMetadata?: Record<string, any>,
): SerializedError {
  const { status, description, title, source } = errorConfig;
  const errorObject: JsonApiError = {
    id: uuidv4(),
    status: status.statusCode.toString(),
    code: status.code,
    title: title ?? status.title,
    detail: description ?? status.description,
    metadata: {
      requestId: (req as any).requestId,
      timestamp: new Date().toISOString(),
      ...additionalMetadata,
    },
    source: {
      pointer: source?.pointer ?? req.originalUrl,
      method: source?.method ?? req.method,
    },
  };

  return {
    error: errorObject,
    metadata: errorObject.metadata,
  };
}

export const createJsonApiResourceSchema = <T extends z.ZodType>(
  type: string,
  attributesSchema: T,
) => {
  return z.object({
    type: z.literal(type),
    id: z.string().uuid(),
    attributes: attributesSchema,
    relationships: z.record(z.string(), z.any()).optional(), // Fixed: z.record needs (key, value)
    meta: z.record(z.string(), z.any()).optional(), // Fixed: z.record needs (key, value)
    links: z.record(z.string(), z.string()).optional(), // Fixed: z.record needs (key, value)
  });
};

export const createJsonApiSingleResponseSchema = <T extends z.ZodType>(
  resourceSchema: T,
) => {
  return z.object({
    data: resourceSchema,
    links: z.object({
      self: z.string(),
    }),
    metadata: z
      .object({
        requestId: z.string(),
        timestamp: z.string(),
      })
      .catchall(z.any()), // Allows additionalMeta
  });
};

export const createJsonApiCollectionResponseSchema = <T extends z.ZodType>(
  resourceSchema: T,
) => {
  return z.object({
    data: z.array(resourceSchema),
    links: z.object({
      self: z.string(),
    }),
    metadata: z
      .object({
        requestId: z.string(),
        timestamp: z.string(),
      })
      .catchall(z.any()), // Allows additionalMeta like total
  });
};
