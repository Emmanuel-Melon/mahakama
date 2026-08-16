import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z, ZodRawShape } from "zod";

import { HttpStatus } from "../http/http.status";

extendZodWithOpenApi(z);

export type PathConfig = Parameters<OpenAPIRegistry["registerPath"]>[0];
export type OpenApiResponses = PathConfig["responses"];
export type AvailableStatusCode =
  (typeof HttpStatus)[keyof typeof HttpStatus]["statusCode"];

export interface GeneratedApiResponseSchemas {
  resourceSchema: z.ZodObject<ZodRawShape>;
  singleResSchema: z.ZodObject<ZodRawShape>;
  colResSchema: z.ZodObject<ZodRawShape>;
}

export interface ApiResourceSchemas {
  kind: "crud";
  select: z.ZodObject<ZodRawShape>;
  insert?: z.ZodObject<ZodRawShape>;
  update?: z.ZodObject<ZodRawShape>;
}

export interface ApiEndpointSchemas {
  kind: "action";
  response: z.ZodObject<ZodRawShape>;
  requests: Record<string, z.ZodObject<ZodRawShape>>;
}

export type ResourceSchemas = ApiResourceSchemas | ApiEndpointSchemas;

interface BaseRegistryConfig {
  registry: OpenAPIRegistry;
  pascalName: string;
  schemas: ResourceSchemas;
}

export interface RegisterSchemasOptions extends BaseRegistryConfig {
  resourceType: string;
}

/*
 * PATH CONFIG
 */
export interface PathDefinition {
  handlerName: string;
  method: "post" | "get" | "put" | "patch" | "delete";
  path: string;
  summary: string;
  description: string;
  tag?: string;
  security?: Array<Record<string, any[]>>;
  requestBodySchema?: any;
  successStatus: (typeof HttpStatus)[keyof typeof HttpStatus];
  successSchema?: any;
  errorCodes?: AvailableStatusCode[];
  customResponses?: Record<number | string, any>;
  extraMeta?: z.ZodObject<any>;
  requestParams?: any;
}

export interface RegisterRoutesOptions {
  registry: OpenAPIRegistry;
  defaultTag: string;
  routes: PathDefinition[];
}

export const pathIdParameterSchema = z.object({
  id: z.string().uuid(),
});

export interface ComponentRegistrationContext {
  registry: OpenAPIRegistry;
  pascalName: string;
  resourceType: string;
  schema: z.ZodObject<any>;
}

export type ResourceContext = {
  registry: OpenAPIRegistry;
  pascalName: string;
  resourceType: string;
};

export const collectionPaginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  availableFilters: z.record(z.string(), z.any()).default({}),
  sortOptions: z.object({
    fields: z.array(z.string()),
    default: z.string(),
    direction: z.enum(["asc", "desc"]),
  }),
});
