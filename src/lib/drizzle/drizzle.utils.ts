import { HttpStatus } from "@/http-status";
import {
  ConflictError,
  EntityNotFoundError,
  HttpError,
} from "../http/http.error";
import { PG_ERROR_CODES } from "./drizzle.errors";
import {
  DbSingleResult,
  DbManyResult,
  DbResult,
  PaginatedResult,
} from "./drizzle.types";

export const toSingleResult = <T>(
  data: T | undefined | null,
): DbSingleResult<T> =>
  data == null ? { data: null, ok: false } : { data, ok: true };

export const toResult = <T>(data: T | null | undefined): DbResult<T> =>
  data == null ? { ok: false, data: null } : { ok: true, data };

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

export async function withDbErrorHandler<T>(
  operation: () => Promise<T[]>,
  options: { conflictMessage?: string; notFoundMessage?: string } = {},
) {
  try {
    const results = await operation();
    return toResult(results[0]);
  } catch (error: any) {
    // 1. Unique Violation (Slug/Name exists)
    if (
      error.code === PG_ERROR_CODES.UNIQUE_VIOLATION &&
      options.conflictMessage
    ) {
      throw new ConflictError(options.conflictMessage);
    }

    // 2. Foreign Key Violation (ID doesn't exist in parent table)
    if (error.code === PG_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
      throw new EntityNotFoundError(
        options.notFoundMessage || "Related record not found",
      );
    }

    throw error;
  }
}
