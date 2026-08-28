import { Request, RequestHandler, Response } from "express";
import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import swaggerUi from "swagger-ui-express";
import { z } from "zod";
import { mahakamaServers } from "@/config";

import { usersRegistry } from "@/feature/users/users.docs";
import { authRegistry } from "@/feature/auth/auth.docs";
import { expressRegistry } from "../express/express.schema";
import { lawyersRegistry } from "@/feature/lawyers/lawyers.docs";
import { corpusRegistry } from "@/feature/corpus/corpus.docs";
import { messagesRegistry } from "@/feature/messages/messages.docs";
import { chatsRegistry } from "@/feature/chats/chats.docs";
import { servicesRegistry } from "@/feature/services/services.docs";
import { consultationsRegistry } from "@/feature/consultations/consultations.docs";

extendZodWithOpenApi(z);

const securityRegistry = new OpenAPIRegistry();
securityRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "JWT Bearer token for authentication",
});

// Combine all registries
const registries = [
  authRegistry,
  chatsRegistry,
  consultationsRegistry,
  corpusRegistry,
  expressRegistry,
  lawyersRegistry,
  messagesRegistry,
  servicesRegistry,
  usersRegistry,
  securityRegistry,
];

const definitions = registries.flatMap((r) => r.definitions);
const generator = new OpenApiGeneratorV3(definitions);

export const openApiSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Mahakama Legal Assistant API",
    version: "1.0.0",
    description: "API documentation for Mahakama Legal Assistant",
  },
  servers: mahakamaServers,
});

// Serve raw JSON
export const rawJSONDocs = (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(openApiSpec);
};

// Setup Swagger UI
export const swaggerSetup = () => {
  return [
    swaggerUi.serve as unknown as RequestHandler,
    swaggerUi.setup(openApiSpec, {
      explorer: true,
      customCss: ".swagger-ui .info { margin: 20px 0 }",
    }) as unknown as RequestHandler,
  ] as RequestHandler[];
};
