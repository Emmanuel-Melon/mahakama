import type { ComponentType } from "react";
import {
  OfflineError,
  SessionExpiredError,
  AccessDeniedError,
  NotFoundError,
  ServerError,
} from "@mah/ui";
import type { ErrorComponentProps } from "./errors.types";

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
