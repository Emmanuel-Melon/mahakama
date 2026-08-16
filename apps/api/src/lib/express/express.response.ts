import { Request, Response } from "express";

import { HttpStatus } from "@/lib/http/http.status";

import type { StatusConfig } from "../http/http.types";
import { serializeError, serializeJsonApi } from "./express.serializer";
import {
  ErrorResponseConfig,
  ErrorResponseOptions,
  JsonApiErrorObject,
  JsonApiErrorResponse,
  JsonApiResponseConfig,
  SuccessResponseOptions,
} from "./express.types";

export const sendErrorResponse = (
  req: Request,
  res: Response,
  errorInput: ErrorResponseConfig | JsonApiErrorObject[],
  opts?: ErrorResponseOptions,
): Response<JsonApiErrorResponse> => {
  let errors: JsonApiErrorObject[];

  if (Array.isArray(errorInput)) {
    errors = errorInput;
  } else {
    const { error } = serializeError(req, errorInput, opts);
    errors = [error];
  }

  const status = Array.isArray(errorInput)
    ? Number(errors[0]?.status ?? 500)
    : errorInput.status.statusCode;

  return res.status(status).json({ errors });
};

export const sendSuccessResponse = <T>(
  req: Request,
  res: Response,
  responseConfig?: JsonApiResponseConfig<T>,
  opts?: SuccessResponseOptions,
): Response => {
  const status = opts?.status || HttpStatus.SUCCESS;
  const statusCode = status.statusCode;

  if (statusCode === HttpStatus.NO_CONTENT.statusCode) {
    return res.status(statusCode).send();
  }

  if (!responseConfig) {
    throw new Error(
      `Status ${statusCode} requires a responseConfig for serialization.`,
    );
  }

  const { data, metadata } = serializeJsonApi(req, {
    responseConfig,
    metadata: opts?.additionalMeta,
  });

  const response = {
    data,
    links: {
      self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      ...opts?.links,
    },
    metadata: metadata,
  };

  return res.status(statusCode).json(response);
};

export const sendSimpleJson = <T>(
  res: Response,
  data: T,
  status: StatusConfig = HttpStatus.SUCCESS,
): Response => {
  return res.status(status.statusCode).json(data);
};
