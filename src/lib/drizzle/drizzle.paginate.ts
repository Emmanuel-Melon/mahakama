import { SQL, desc, asc, sql, ilike, or, and } from "drizzle-orm";
import { PgTable, PgColumn } from "drizzle-orm/pg-core";
import { db } from "./index";
import { PaginationParams } from "./drizzle.types";

type SchemaKeys = keyof typeof db.query;

export async function paginate<K extends SchemaKeys, T>(
  tableKey: K,
  tableObj: PgTable,
  params: PaginationParams & {
    filters?: SQL[];
    search?: { columns: PgColumn[]; q?: string };
  },
): Promise<{ data: T[]; metadata: any }> {
  // We explicitly return T[]
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(params.limit || 10, 100));
  const offset = (page - 1) * limit;

  const conditions: SQL[] = params.filters || [];
  if (params.search?.q && params.search.columns.length > 0) {
    const searchVal = `%${params.search.q}%`;
    const searchConditions = params.search.columns.map((col) =>
      ilike(col, searchVal),
    );
    conditions.push(or(...searchConditions)!);
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [data, totalRes] = await Promise.all([
    (db.query[tableKey] as any).findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (fields: any) => {
        const sortCol = params.sort ? fields[params.sort] : fields.createdAt;
        return params.order === "asc" ? asc(sortCol) : desc(sortCol);
      },
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(tableObj as any)
      .where(whereClause),
  ]);

  return {
    data: data as T[], // Cast the dynamic result to our expected type
    metadata: {
      total: Number(totalRes[0].count),
      page,
      limit,
      totalPages: Math.ceil(Number(totalRes[0].count) / limit),
    },
  };
}

export { PaginationParams };
