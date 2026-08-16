import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import { registerRoutes } from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { authApi } from "./auth.routes";
import { registerRequestSchema, loginRequestSchema } from "./auth.types";

export const authRegistry = new OpenAPIRegistry();

const authPaths: PathDefinition[] = [
  {
    handlerName: "registerController",
    method: "post",
    path: `${authApi.path}/register`,
    summary: "Register a new user",
    description: "Creates a new user account profile",
    security: [],
    requestBodySchema: registerRequestSchema,
    successStatus: HttpStatus.CREATED,
    successSchema: registerRequestSchema,
    errorCodes: [400, 409, 500],
  },
  {
    handlerName: "loginController",
    method: "post",
    path: `${authApi.path}/login`,
    summary: "Login user",
    description: "Authenticates an existing user account",
    security: [],
    requestBodySchema: loginRequestSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: loginRequestSchema,
    errorCodes: [400, 401, 500],
  },
];

registerRoutes({
  registry: authRegistry,
  defaultTag: "Authentication",
  routes: authPaths,
});

authRegistry.register("RegisterRequest", registerRequestSchema);
authRegistry.register("LoginRequest", loginRequestSchema);
