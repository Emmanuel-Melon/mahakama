import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === "object" && "status" in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.errorToast) {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      }
    },
  }),
});
