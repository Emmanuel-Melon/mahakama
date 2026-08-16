import type { DbCollection, ToCollectionOptions } from "../drizzle.types";

export const toCollection = <T>(
  data: T[],
  options: ToCollectionOptions = {},
): DbCollection<T> => ({
  data,
  count: options.overrideCount ?? data.length,
  isEmpty: data.length === 0,
});
