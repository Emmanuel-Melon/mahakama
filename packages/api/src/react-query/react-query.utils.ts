import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateMutationOptions } from "./react-query.types";
import { toast } from "sonner";

export const useAppMutation = <TData, TError, TVariables>(
  options: CreateMutationOptions<TData, TError, TVariables>,
) => {
  const queryClient = useQueryClient();
  const { invalidates, onSuccess, messages, ...rest } = options;

  return useMutation<TData, TError, TVariables>({
    ...rest,
    onSuccess: (data, variables) => {
      const keys =
        typeof invalidates === "function"
          ? invalidates(variables)
          : invalidates;
      keys?.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      onSuccess?.(data, variables);
      if (messages.success) {
        const successMessage =
          typeof messages.success === "function"
            ? messages.success(data)
            : messages.success;
        toast(successMessage);
      }
    },
    onError: (error) => {
      const errorMessage =
        typeof messages.error === "function"
          ? messages.error(error)
          : messages.error;

      console.error(`Mutation Error:`, error);
      toast.error(errorMessage);
    },
  });
};
