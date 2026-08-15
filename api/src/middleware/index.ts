import { Application } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import swaggerUi from "swagger-ui-express";

import { serverConfig, storageConfig } from "@/config";
import { checkServerHealthController, welcomeController } from "@/lib/express";
import { rawJSONDocs, swaggerSetup } from "@/lib/openapi";
import { ensureStorageDir } from "@/lib/storage/storage";
import mahakamaRouter from "@/routes";
import { authRouter } from "@/service/auth/auth.routes";

import { corsMiddleware } from "./cors";
import { globalErrorHandler } from "./errors";
import { requestLogger } from "./http-request-logger";
import { getIpAddress } from "./ip-address";
import { requestMetadata } from "./request-metadata";
import { userAgentMiddleware } from "./user-agent";

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

  // Public file serving (uploads) — before the /api router (auth-guarded)
  ensureStorageDir();
  app.use("/uploads", express.static(path.resolve(storageConfig.dir)));

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
