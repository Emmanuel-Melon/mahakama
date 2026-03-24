import { useRouteError, isRouteErrorResponse } from "react-router";
import type { AppRouteError } from "~/lib/errors/errors.types";

export const useAppError = (): AppRouteError => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return { status: error.status, data: error.data };
  }
  return { status: 500 };
};