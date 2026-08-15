import { z } from "zod";

export const dbQueryOptionsSchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  page: z.coerce.number().int().positive().default(1),
  search: z.string().optional(),
  sortBy: z.string().default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type BaseDbQueryOptions = z.infer<typeof dbQueryOptionsSchema>;

export type DbQueryOptions<TFields = string> = Partial<
  Omit<BaseDbQueryOptions, "sortBy">
> & {
  sortBy?: TFields;
};
