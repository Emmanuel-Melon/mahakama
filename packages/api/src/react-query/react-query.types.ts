import type { QueryKey, UseMutationOptions } from "@tanstack/react-query";

export type MutationMessages<TData, TError> = {
  success?: string | ((data: TData) => string);
  error: string | ((error: TError) => string);
};

export type CreateMutationOptions<TData, TError, TVariables> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  "onSuccess" | "onError"
> & {
  messages: MutationMessages<TData, TError>;
  invalidates?: QueryKey[] | ((variables: TVariables) => QueryKey[]);
  onSuccess?: (data: TData, variables: TVariables) => void;
};
