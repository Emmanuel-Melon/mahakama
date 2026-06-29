import type { QueryClient } from "@tanstack/react-query";
import type { Route } from "~/+types/root";

export type PrefetchConfig<T = unknown> = {
  queryKey: unknown[];
  queryFn: () => Promise<T>;
  staleTime?: number;
};

export type LoaderContext = Route.LoaderArgs["context"] & {
  queryClient: QueryClient;
};

export type ExtractData<T extends PrefetchConfig[]> = {
  [K in keyof T]: T[K] extends PrefetchConfig<infer D> ? D : never;
};

export type PrefetchOptions = {
  returnData?: boolean;
  throwOnError?: boolean;
};
