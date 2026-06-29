import type { ComponentType } from "react";
import { OfflineError } from "~/components/errors/OfflineError";
import { SessionExpiredError } from "~/components/errors/SessionExpiredError";
import { AccessDeniedError } from "~/components/errors/AccessDeniedError";
import { NotFoundError } from "~/components/errors/NotFoundError";
import { ServerError } from "~/components/errors/ServerError";
import type { ErrorComponentProps } from "./errors.types";

export const ERROR_COMPONENT_MAP: Record<number, ComponentType<ErrorComponentProps>> = {
  401: SessionExpiredError,
  403: AccessDeniedError,
  404: NotFoundError,
  503: OfflineError,
  500: ServerError,
};
