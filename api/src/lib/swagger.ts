import { Request, Response, RequestHandler } from "express";
import swaggerUi from "swagger-ui-express";
import { mahakamaServers } from "@/config";
import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { usersRegistry } from "@/feature/users/users.docs";
import { authRegistry } from "@/service/auth/auth.docs";
import { expressRegistry } from "./express/express.schema";
import { lawyersRegistry } from "@/feature/lawyers/lawyers.docs";
import { documentsRegistry } from "@/feature/documents/documents.docs";
import { messagesRegistry } from "@/feature/messages/messages.docs";
import { chatsRegistry } from "@/feature/chats/chats.docs";
import { servicesRegistry } from "@/feature/services/services.docs";

extendZodWithOpenApi(z);

// Create a registry for security schemes
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
  documentsRegistry,
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
