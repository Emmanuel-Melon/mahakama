import { db } from "@/lib/drizzle";

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DbManyResult<T> {
  data: T[];
  count: number;
  isEmpty: boolean;
  metadata?: PaginationMetadata;
}

export type DbResult<T> = { ok: true; data: T } | { ok: false; data: null };

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SchemaConfig {
  omit?: string[];
}

export interface GenerateSchemasOptions {
  titlePrefix: string;
  select?: SchemaConfig;
  insert?: SchemaConfig;
  update?: SchemaConfig;
}

export interface ToCollectionOptions {
  overrideCount?: number;
}

export type DbErrorType =
  "NOT_FOUND" | "DATABASE_ERROR" | "VALIDATION_ERROR" | "CONFLICT";

export interface DbCollection<T> {
  data: T[];
  count: number;
  isEmpty: boolean;
}

export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

export type DbError = { type: DbErrorType; reason: string };

export type PgTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
