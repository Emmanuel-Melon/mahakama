import type { PrefetchConfig, LoaderContext, ExtractData, PrefetchOptions } from "./react-query.types";

export function createPrefetchLoader<T extends PrefetchConfig[]>(
    configs: T,
    options: PrefetchOptions & { returnData: true }  // literal true, not boolean
): ({ context }: { context: LoaderContext }) => Promise<ExtractData<T>>;

export function createPrefetchLoader<T extends PrefetchConfig[]>(
    configs: T,
    options?: PrefetchOptions & { returnData?: false }
): ({ context }: { context: LoaderContext }) => Promise<null>;

export function createPrefetchLoader<T extends PrefetchConfig[]>(
    configs: T,
    options?: PrefetchOptions
) {
    return async ({ context }: { context: LoaderContext }) => {

        if (options?.throwOnError) {
            await Promise.all(
                configs.map(({ queryKey, queryFn, staleTime }) =>
                    context.queryClient.ensureQueryData({ queryKey, queryFn, staleTime })
                )
            );
        } else {
            // your current allSettled logic
            const results = await Promise.allSettled(
                configs.map(({ queryKey, queryFn, staleTime }) =>
                    context.queryClient.ensureQueryData({ queryKey, queryFn, staleTime })
                )
            );
            if (options?.returnData) {
                return results.map((r) =>
                    r.status === "fulfilled" ? r.value : null
                );
            }
        }
        return null;
    };
}

export function prefetch<T>(config: PrefetchConfig<T>): PrefetchConfig<T> {
  return config;
}