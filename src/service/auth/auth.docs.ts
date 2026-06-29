import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerRequestSchema, loginRequestSchema } from "./auth.types";
import { HttpStatus } from "@/http-status";

export const authRegistry = new OpenAPIRegistry();

authRegistry.register("RegisterRequest", registerRequestSchema);
authRegistry.register("LoginRequest", loginRequestSchema);

authRegistry.registerPath({
  method: "post",
  path: "/auth/v1/register",
  tags: ["Authentication"],
  security: [],
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.CREATED.statusCode]: {
      description: HttpStatus.CREATED.description,
      content: {
        "application/json": {
          schema: registerRequestSchema,
        },
      },
    },
    [HttpStatus.BAD_REQUEST.statusCode]: {
      description: HttpStatus.BAD_REQUEST.description,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/JsonApiErrorResponse",
          },
        },
      },
    },
    [HttpStatus.CONFLICT.statusCode]: {
      description: "User already exists",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/JsonApiErrorResponse",
          },
        },
      },
    },
  },
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/v1/login",
  tags: ["Authentication"],
  security: [],
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: loginRequestSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/JsonApiErrorResponse",
          },
        },
      },
    },
    [HttpStatus.BAD_REQUEST.statusCode]: {
      description: HttpStatus.BAD_REQUEST.description,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/JsonApiErrorResponse",
          },
        },
      },
    },
  },
});
