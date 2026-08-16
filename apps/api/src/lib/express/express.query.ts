import { Request } from "express";

import { BaseQueryParams, baseQuerySchema } from "./express.types";
import { DbQueryOptions } from "@/types/query-options";

export function parseQueryOptions<TFields extends string>(
  req: Request,
  config: {
    sortableFields: readonly TFields[];
    defaultSort: TFields;
    defaultLimit?: number;
  },
): DbQueryOptions<TFields> {
  const limit = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : (config.defaultLimit ?? 10);
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const search = req.query.search as string | undefined;

  const querySort = req.query.sortBy as string;
  const sortBy = config.sortableFields.includes(querySort as TFields)
    ? (querySort as TFields)
    : config.defaultSort;

  const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

  return { limit, page, search, sortBy, sortOrder };
}

export const parsePagination = (req: Request): BaseQueryParams => {
  return baseQuerySchema.parse(req.query);
};
