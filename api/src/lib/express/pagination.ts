import { ilike, or } from "drizzle-orm";
import {
  PaginationOptions,
  PaginationParams,
  PaginationResult,
  SortDirection,
  SortConfig,
  SortConfigOptions,
  GetRequestQuery,
} from "./express.types";

export function getPaginationParams(
  options: PaginationOptions = {},
): PaginationParams {
  const {
    page: pageInput = 1,
    limit: limitInput,
    maxLimit = 100,
    defaultLimit = 10,
  } = options;

  const page = Math.max(1, Number(pageInput) || 1);
  let limit = defaultLimit;
  if (limitInput !== undefined) {
    const parsedLimit = Number(limitInput);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limit = Math.min(parsedLimit, maxLimit);
    }
  }
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function getSortConfig<T extends readonly string[]>({
  sortBy,
  order,
  validFields,
  defaultField,
  defaultDirection = "desc",
}: SortConfigOptions<T>): SortConfig<T> {
  const direction = order?.toLowerCase() === "asc" ? "asc" : defaultDirection;
  const field =
    sortBy && validFields.includes(sortBy as T[number])
      ? (sortBy as T[number])
      : defaultField;
  return { field, direction };
}

export const applySearchConditions = (
  options: GetRequestQuery,
  query: {
    schema: any;
    searchQuery: any;
    fields: readonly string[];
  },
) => {
  if (!options.search) {
    return undefined;
  }

  const formattedSearchQuery = `%${query.searchQuery}%`;
  const searchFilters = query.fields.map((field) =>
    ilike(query.schema[field], formattedSearchQuery),
  );
  return or(...searchFilters);
};
