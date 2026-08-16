import { Request, Response } from "express";

import { serverConfig } from "@/config";
import { HttpStatus } from "@/lib/http/http.status";

import {
  healthCheckSerializerConfig,
  welcomeResponseSerializerConfig,
} from "./express.config";
import { sendErrorResponse, sendSuccessResponse } from "./express.response";
import type { HealthCheckResponse, WelcomeResponse } from "./express.types";

export const testServerHealth = (): Promise<HealthCheckResponse> => {
  return Promise.resolve({
    status: "healthy",
    message: "Mahakama API is up and running! ✨",
    environment: serverConfig.environment,
    timestamp: new Date().toISOString(),
    services: {
      database: "connected",
    },
  });
};

export const checkServerHealthController = async (
  req: Request,
  res: Response,
) => {
  const healthCheck = await testServerHealth();
  try {
    sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...healthCheck,
          id: req.requestId,
        },
        serializerConfig: healthCheckSerializerConfig,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  } catch (error) {
    healthCheck.status = "unhealthy";
    healthCheck.message = "Service Unavailable";
    healthCheck.error =
      error instanceof Error ? error.message : "Unknown error";
    sendErrorResponse(req, res, {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      description: "Service Unavailable",
    });
  }
};

export const welcomeController = (req: Request, res: Response) => {
  const baseUrl = `${serverConfig.protocol}://${serverConfig.hostname}${
    serverConfig.port ? `:${serverConfig.port}` : ""
  }`;
  const response: WelcomeResponse = {
    message: "Welcome to Mahakama API - Legal Knowledge Platform",
    documentation: `${baseUrl}${serverConfig.endpoints.docs}`,
    environment: serverConfig.environment,
    timestamp: new Date().toISOString(),
    status: "healthy",
    endpoints: {
      health: `${baseUrl}${serverConfig.endpoints.health}`,
      apiDocs: `${baseUrl}${serverConfig.endpoints.docs}`,
      apiBase: `${baseUrl}${serverConfig.endpoints.api}`,
    },
  };
  return sendSuccessResponse(
    req,
    res,
    {
      data: {
        ...response,
        id: "welcome",
      },
      serializerConfig: welcomeResponseSerializerConfig,
      type: "single",
    },
    {
      status: HttpStatus.SUCCESS,
    },
  );
};
