import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z, ZodTypeAny } from "zod";

import {
  createJsonApiCollectionResponseSchema,
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
} from "../express/express.serializer";
import {
  collectionPaginationMetaSchema,
  ResourceContext,
  type GeneratedApiResponseSchemas,
  type PathDefinition,
} from "./openapi.types";
import { AnyZodObject } from "../zod";

export function registerCrudBaseSchemas(
  registry: OpenAPIRegistry,
  pascalName: string,
  schemas: {
    select: z.ZodObject<any>;
    insert?: z.ZodObject<any>;
    update?: z.ZodObject<any>;
  },
): void {
  registry.register(pascalName, schemas.select as AnyZodObject);
  if (schemas.insert)
    registry.register(`New${pascalName}`, schemas.insert as AnyZodObject);
  if (schemas.update)
    registry.register(`Update${pascalName}`, schemas.update as AnyZodObject);
}

export function registerActionRequestSchemas(
  registry: OpenAPIRegistry,
  pascalName: string,
  requests: Record<string, z.ZodObject<any>>,
): void {
  for (const [name, schema] of Object.entries(requests)) {
    const pascalNamePart = name.charAt(0).toUpperCase() + name.slice(1);
    registry.register(`${pascalName}${pascalNamePart}`, schema as AnyZodObject);
  }
}

export function registerJsonApiResourceSchemas(
  ctx: ResourceContext,
  schema: z.ZodObject<any>,
  singleMeta?: z.ZodObject<any>,
  colMeta: z.ZodObject<any> = collectionPaginationMetaSchema,
): GeneratedApiResponseSchemas {
  const resourceSchema = createJsonApiResourceSchema(ctx.resourceType, schema);
  const singleResSchema = createJsonApiSingleResponseSchema(
    resourceSchema,
    singleMeta,
  );
  const colResSchema = createJsonApiCollectionResponseSchema(
    resourceSchema,
    colMeta,
  );

  ctx.registry.register(
    `${ctx.pascalName}Resource`,
    resourceSchema as AnyZodObject,
  );
  ctx.registry.register(
    `${ctx.pascalName}SingleResponse`,
    singleResSchema as AnyZodObject,
  );
  ctx.registry.register(
    `${ctx.pascalName}CollectionResponse`,
    colResSchema as AnyZodObject,
  );

  return { resourceSchema, singleResSchema, colResSchema };
}

export function handleRouteExtraMeta(
  registry: OpenAPIRegistry,
  route: PathDefinition,
): z.ZodObject<any> | undefined {
  if (!route.extraMeta || !route.successSchema) return route.successSchema;
  const merged = route.successSchema.shape.metadata.merge(route.extraMeta);
  const updated = replaceMetadataSchema(route.successSchema, merged);
  registry.register(`${route.handlerName}Response`, updated as AnyZodObject);
  return updated;
}

export function replaceMetadataSchema(
  originalSchema: z.ZodObject<any>,
  newMetadataSchema: z.ZodObject<any>,
): z.ZodObject<any> {
  const shape = originalSchema.shape;
  return z.object({
    data: shape.data,
    links: shape.links,
    metadata: newMetadataSchema,
  });
}

export function crudMeta<T extends ZodTypeAny>(
  schema: T,
  type: "insert" | "select" | "update",
  resource: string,
) {
  const titles = {
    insert: `New${resource}`,
    select: resource,
    update: `Update${resource}Request`,
  };
  const descriptions = {
    insert: `Request schema for creating a new ${resource.toLowerCase()}`,
    select: `${resource} response schema`,
    update: `Request schema for updating a ${resource.toLowerCase()}`,
  };
  return schema.openapi({
    title: titles[type],
    description: descriptions[type],
  });
}
