import { Application } from "express";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { globalErrorHandler } from "./errors";
import { authRouter } from "@/service/auth/auth.routes";
import { getIpAddress } from "./ip-address";
import { requestLogger } from "./http-request-logger";
import { userAgentMiddleware } from "./user-agent";
import { corsMiddleware } from "./cors";
import { serverConfig } from "@/config";
import cookieParser from "cookie-parser";
import { swaggerSetup, rawJSONDocs } from "@/lib/swagger";
import { welcomeController, checkServerHealthController } from "@/lib/express";
import mahakamaRouter from "@/routes";
import { requestMetadata } from "./request-metadata";

export function initializeMiddlewares(app: Application): void {
  // global middleware
  app.use(helmet());
  app.use(corsMiddleware);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.set("trust proxy", serverConfig.trustProxy);
  app.use(cookieParser());

  // API DOCUMENTATION
  app.use("/api-docs", swaggerUi.serve, swaggerSetup());
  // Raw JSON schema endpoint
  app.get("/api-docs.json", rawJSONDocs);

  // Request logging
  app.use(requestMetadata);
  app.use(requestLogger);

  // Apply middlewares to all routes
  app.use(userAgentMiddleware);
  // app.use(fingerprintMiddleware);
  app.use(getIpAddress);

  // API routes
  app.get("/", welcomeController);
  app.get(["/health", "/api/health"], checkServerHealthController);

  // Debug: Log auth router registration
  app.use("/auth/v1", authRouter);

  app.use("/api", mahakamaRouter);

  // ERROR HANDLERS
  app.use(globalErrorHandler);
}
