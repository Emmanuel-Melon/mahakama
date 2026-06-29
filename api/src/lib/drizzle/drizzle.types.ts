export type DbSingleResult<T> =
  | { data: T; ok: true }
  | { data: null; ok: false };

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
