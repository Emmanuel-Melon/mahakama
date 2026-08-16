import { z, ZodRawShape } from "zod";

import { buildErrorResponse, buildResponse } from "./openapi.response";
import {
  ApiResourceSchemas,
  collectionPaginationMetaSchema,
  pathIdParameterSchema,
  type GeneratedApiResponseSchemas,
  type RegisterRoutesOptions,
  type RegisterSchemasOptions,
} from "./openapi.types";
import {
  handleRouteExtraMeta,
  registerActionRequestSchemas,
  registerCrudBaseSchemas,
  registerJsonApiResourceSchemas,
} from "./openapi.utils";

export function defineApiResource<
  S extends z.ZodObject<ZodRawShape>,
  I extends z.ZodObject<ZodRawShape> | undefined = undefined,
  U extends z.ZodObject<ZodRawShape> | undefined = undefined,
>(config: { select: S; insert?: I; update?: U }): ApiResourceSchemas {
  return {
    kind: "crud",
    select: config.select,
    ...(config.insert && { insert: config.insert }),
    ...(config.update && { update: config.update }),
  };
}

export function registerJsonApiSchemas({
  registry,
  resourceType,
  pascalName,
  schemas,
}: RegisterSchemasOptions): GeneratedApiResponseSchemas {
  if (schemas.kind === "action") {
    registerActionRequestSchemas(registry, pascalName, schemas.requests);
    return registerJsonApiResourceSchemas(
      { registry, pascalName, resourceType },
      schemas.response,
      undefined,
      collectionPaginationMetaSchema,
    );
  }

  // CRUD
  registerCrudBaseSchemas(registry, pascalName, schemas);
  return registerJsonApiResourceSchemas(
    { registry, pascalName, resourceType },
    schemas.select,
    undefined,
    collectionPaginationMetaSchema,
  );
}

export function registerRoutes({
  registry,
  defaultTag,
  routes,
}: RegisterRoutesOptions): void {
  routes.forEach((route) => {
    const standardParams = route.path.includes("{id}")
      ? pathIdParameterSchema
      : undefined;

    const finalSuccessSchema =
      handleRouteExtraMeta(registry, route) ?? route.successSchema;

    const responses = {
      ...buildResponse(route.successStatus, finalSuccessSchema || null),
      ...buildErrorResponse(route.errorCodes || []),
      ...(route.customResponses || {}),
    };

    registry.registerPath({
      method: route.method,
      path: route.path,
      summary: route.summary,
      description: route.description,
      tags: [route.tag || defaultTag],
      security: route.security || [],
      request: {
        params: route.requestParams || standardParams,
        ...(route.requestBodySchema && {
          body: {
            content: {
              "application/json": { schema: route.requestBodySchema },
            },
          },
        }),
      },
      responses,
    });
  });
}
