import { HttpStatus } from "@/lib/http/http.status";
import { HttpError } from "../http/http.error";
import type {
  DbManyResult,
  DbResult,
  PaginatedResult,
  GenerateSchemasOptions,
} from "./drizzle.types";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { PgTable } from "drizzle-orm/pg-core";
import type { z } from "zod";

function buildOmit<T extends string>(fields: T[] = []): Record<T, true> {
  return Object.fromEntries(fields.map((f) => [f, true])) as Record<T, true>;
}

export function generateDrizzleCrudSchemas<TTable extends PgTable>(
  table: TTable,
  options: GenerateSchemasOptions,
) {
  const insertSchema = createInsertSchema(table)
    .omit(buildOmit(options.insert?.omit) as any)
    .openapi({
      title: `New${options.titlePrefix}`,
      description: `Request schema for creating a new ${options.titlePrefix.toLowerCase()}`,
    });

  const selectSchema = createSelectSchema(table)
    .omit(buildOmit(options.select?.omit) as any)
    .openapi({
      title: options.titlePrefix,
      description: `${options.titlePrefix} response schema`,
    });

  const updateOmit = {
    id: true,
    createdAt: true,
    ...buildOmit(options.update?.omit),
  };
  const updateSchema = insertSchema
    .omit(updateOmit as any)
    .partial()
    .openapi({
      title: `Update${options.titlePrefix}Request`,
      description: `Request schema for updating a ${options.titlePrefix.toLowerCase()}`,
    });

  return { insertSchema, selectSchema, updateSchema };
}

export function toManyResult<T>(
  result: T[] | PaginatedResult<T>,
): DbManyResult<T> {
  if ("metadata" in result) {
    return {
      data: result.data,
      count: result.metadata.total,
      isEmpty: result.data.length === 0,
      metadata: result.metadata,
    };
  }

  return {
    data: result,
    count: result.length,
    isEmpty: result.length === 0,
  };
}

export function unwrap<T>(
  result: DbResult<T>,
  errorSource?: string | Error,
): T {
  if (result.ok) {
    return result.data;
  }

  if (errorSource instanceof Error) {
    throw errorSource;
  }

  if (typeof errorSource === "string") {
    throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, errorSource);
  }

  throw new HttpError(
    HttpStatus.INTERNAL_SERVER_ERROR,
    "Database operation failed",
  );
}
