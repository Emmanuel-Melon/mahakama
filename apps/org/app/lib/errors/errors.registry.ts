import type { ComponentType } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router";
import {
  OfflineError,
  SessionExpiredError,
  AccessDeniedError,
  NotFoundError,
  ServerError,
} from "@mah/ui";
import type { ErrorComponentProps, AppRouteError } from "@mah/client/errors";

export const ERROR_COMPONENT_MAP: Record<
  number,
  ComponentType<ErrorComponentProps>
> = {
  401: SessionExpiredError,
  403: AccessDeniedError,
  404: NotFoundError,
  503: OfflineError,
  500: ServerError,
};

export const getErrorComponent = (
  status?: number,
): ComponentType<ErrorComponentProps> => {
  return (status && ERROR_COMPONENT_MAP[status]) || ServerError;
};

export const useAppError = (): AppRouteError => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return { status: error.status, data: error.data };
  }
  return { status: 500 };
};
