import { z, ZodTypeAny } from "zod";
import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
import { Request, Response, NextFunction } from "express";
import { StatusConfig } from "@/http-status";
import {
  JsonApiError,
  ResponseLinks,
  ResponseMetadata,
} from "./express.schema";

// server types
export type ServerStatus = "healthy" | "maintenance" | "unhealthy";
export type ResourceType = "single" | "collection";
export interface ResourceLinkObject {
  self?: string;
  related?: string;
  [key: string]: string | undefined;
}
export interface ResourceIdentifierObject {
  type: string;
  id: string;
}
export type ResourceLinkage =
  | ResourceIdentifierObject
  | ResourceIdentifierObject[]
  | null;
export interface ResourceObject<T> {
  type: string;
  id: string;
  attributes: Record<string, any>;
  relationships?: Record<
    string,
    {
      links?: ResourceLinkObject;
      data?: ResourceLinkage;
    }
  >;
  meta?: Record<string, any>;
  links?: Record<string, string>;
}
export interface RelationshipObject<T> {
  links?: (resource: T, req: Request) => ResourceLinkObject;
  data?: (resource: T) => ResourceLinkage;
}

// Base type for all SSE events
export type SSEEvent<T = any, Type extends string = string> = {
  type: Type;
  data?: T;
  id?: string;
  retry?: number;
};

// Helper type to extract the data type from an event type
export type EventDataType<T> = T extends { type: string; data?: infer D }
  ? D
  : never;

// Helper type to create strongly typed events
export function createEvent<T extends string, D = any>(
  type: T,
  data: D,
  options?: { id?: string; retry?: number },
): SSEEvent<D, T> {
  return {
    type,
    data,
    id: options?.id,
    retry: options?.retry,
  };
}
export type ErrorResponseConfig = Partial<
  Pick<StatusConfig, "description" | "title">
> & {
  status: StatusConfig;
  source?: { pointer?: string; method?: string };
  details?: Record<string, any>;
};

export type ControllerMetadata = {
  name: string;
  route: string;
  operation?: string;
  resourceType?: string;
  requestId: string;
  resourceId?: string | number;
};

export type SSEOptions = {
  headers?: Record<string, string>;
  metadata?: ControllerMetadata;
};

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  maxLimit?: number;
  defaultLimit?: number;
}

export interface PaginationResult<T = unknown> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    offset: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export type PaginationQueryParams = {
  page?: number | string;
  limit?: number | string;
  total?: number;
};

export type SortDirection = "asc" | "desc";

export type BaseSortParams = {
  sortBy?: string;
  order?: SortDirection;
};

export type SortConfig<T extends readonly string[]> = {
  field: T[number];
  direction: SortDirection;
};

export type SortConfigOptions<T extends readonly string[]> = {
  /** The field to sort by */
  sortBy?: string;
  /** The sort direction */
  order?: SortDirection;
  /** Array of valid sortable fields */
  validFields: T;
  /** Default field to sort by if none provided */
  defaultField: T[number];
  /** Default sort direction if none provided */
  defaultDirection?: SortDirection;
};

export type SortableFields<T extends readonly string[]> = T[number];

export type BaseFilterParams = {
  search?: string;
};

export type GetRequestQuery = PaginationQueryParams &
  BaseSortParams &
  BaseFilterParams;

export type TypedRequestQuery<T extends ZodTypeAny> = Omit<Request, "query"> & {
  query: z.infer<T> & ParsedQs;
};

export type TypedRequestParams<T extends ZodTypeAny> = Omit<
  Request,
  "params"
> & {
  params: z.infer<T> & ParamsDictionary;
};

export type GetByIdRequest = {
  id: string;
};

// POST Request types
export type CreateRequest<T> = {
  body: T;
};

// PATCH/PUT Request types
export type UpdateRequest<T> = {
  id: string;
  body: Partial<T>; // Partial for PATCH, T for PUT
};

// DELETE Request types
export type DeleteRequest = {
  id: string;
};
export interface HealthCheckResponse {
  status: ServerStatus;
  message: string;
  environment: string;
  timestamp: string;
  services: {
    database: string;
    [key: string]: string | undefined;
  };
  error?: string;
}

export interface WelcomeResponse {
  message: string;
  documentation: string;
  environment: string;
  timestamp: string;
  endpoints: {
    health: string;
    apiDocs: string;
    auth?: string;
    apiBase: string;
  };
  status: ServerStatus;
  version?: string;
}

export interface ResourceResponseOptions {
  requestId?: string;
  successStatus?: StatusConfig;
}

export interface ResourceResponseOptions {
  requestId?: string;
  successStatus?: StatusConfig;
}

export interface JsonApiResourceConfig<T> {
  type: string;
  attributes: (resource: T) => Record<string, any>;
  relationships?: Record<string, RelationshipObject<T>>;
  resourceMeta?: (resource: T) => Record<string, any>;
  links?: (resource: T, req: Request) => ResourceLinkObject;
}

export type JsonApiResponseConfig<T> = {
  type: ResourceType;
  data: (T & { id: string }) | (T & { id: string })[];
  serializerConfig: JsonApiResourceConfig<T>;
};

export interface JsonApiResponse<T> {
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
    [key: string]: any;
  };
}

export interface JsonApiErrorResponse {
  errors: JsonApiError[];
}

export interface SuccessResponseOptions {
  status?: StatusConfig;
  additionalMeta?: Record<string, unknown>;
  links?: ResponseLinks;
}

export interface SerializeJsonApiOptions {
  responseConfig: JsonApiResponseConfig<any>;
  metadata?: Record<string, any>;
}

export interface SerializedResponse<T> {
  data: T | T[];
  metadata: ResponseMetadata;
}

export interface SerializedError {
  error: JsonApiError;
  metadata: ResponseMetadata;
}

export interface ErrorResponseOptions {
  additionalMeta?: Record<string, unknown>;
  errorId?: string;
  suppressLogging?: boolean;
  retryAfter?: number;
  documentationUrl?: string;
  suggestedAction?: string;
  includeStackTrace?: boolean;
  errorCode?: string;
  correlationId?: string;
}

export const baseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  q: z.string().optional(),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type BaseQueryParams = z.infer<typeof baseQuerySchema>;

export type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | any;
