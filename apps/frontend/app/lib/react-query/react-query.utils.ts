import type {
  PrefetchConfig,
  ExtractData,
  PrefetchOptions,
} from "./react-query.types";
import { queryClient } from "~/lib/react-query";

export function createPrefetchLoader<T extends PrefetchConfig[]>(
  configs: T,
  options: PrefetchOptions & { returnData: true }, // literal true, not boolean
): () => Promise<ExtractData<T>>;

export function createPrefetchLoader<T extends PrefetchConfig[]>(
  configs: T,
  options?: PrefetchOptions & { returnData?: false },
): () => Promise<null>;

export function createPrefetchLoader<T extends PrefetchConfig[]>(
  configs: T,
  options?: PrefetchOptions,
) {
  return async () => {
    if (options?.throwOnError) {
      await Promise.all(
        configs.map(({ queryKey, queryFn, staleTime }) =>
          queryClient.ensureQueryData({ queryKey, queryFn, staleTime }),
        ),
      );
    } else {
      const results = await Promise.allSettled(
        configs.map(({ queryKey, queryFn, staleTime }) =>
          queryClient.ensureQueryData({ queryKey, queryFn, staleTime }),
        ),
      );
      if (options?.returnData) {
        return results.map((r) => (r.status === "fulfilled" ? r.value : null));
      }
    }
    return null;
  };
}

export function prefetch<T>(config: PrefetchConfig<T>): PrefetchConfig<T> {
  return config;
}
