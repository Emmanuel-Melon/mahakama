import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { lawyerSelectSchema, createLawyerSchema } from "./lawyers.types";
import { HttpStatus } from "@/http-status";
import {
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
  createJsonApiCollectionResponseSchema,
} from "@/lib/express/express.serializer";

const ErrorResponseRef = { $ref: "#/components/schemas/JsonApiErrorResponse" };
const lawyerResourceSchema = createJsonApiResourceSchema(
  "lawyer",
  lawyerSelectSchema,
);
const lawyerSingleResponseSchema =
  createJsonApiSingleResponseSchema(lawyerResourceSchema);
const lawyersCollectionResponseSchema =
  createJsonApiCollectionResponseSchema(lawyerResourceSchema);

// Create registry and register schemas
export const lawyersRegistry = new OpenAPIRegistry();
lawyersRegistry.register("Lawyer", lawyerSelectSchema);
lawyersRegistry.register("CreateLawyer", createLawyerSchema);
lawyersRegistry.register("LawyerResource", lawyerResourceSchema);
lawyersRegistry.register("LawyerSingleResponse", lawyerSingleResponseSchema);
lawyersRegistry.register(
  "LawyersCollectionResponse",
  lawyersCollectionResponseSchema,
);

// 1. GET /v1/lawyers (Get All Lawyers)
lawyersRegistry.registerPath({
  method: "get",
  path: "/v1/lawyers",
  summary: "Get all lawyers",
  description:
    "Returns a list of all registered lawyers with optional filtering and pagination",
  tags: ["Lawyers v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: lawyersCollectionResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.INTERNAL_SERVER_ERROR.statusCode]: {
      description: HttpStatus.INTERNAL_SERVER_ERROR.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 2. GET /v1/lawyers/{id} (Get Lawyer by ID)
lawyersRegistry.registerPath({
  method: "get",
  path: "/v1/lawyers/{id}",
  summary: "Get lawyer by ID",
  description: "Retrieve lawyer details by lawyer ID",
  tags: ["Lawyers v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Lawyer's unique identifier",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: lawyerSingleResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: HttpStatus.NOT_FOUND.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.INTERNAL_SERVER_ERROR.statusCode]: {
      description: HttpStatus.INTERNAL_SERVER_ERROR.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 3. POST /v1/lawyers (Create a new lawyer)
lawyersRegistry.registerPath({
  method: "post",
  path: "/v1/lawyers",
  summary: "Create a new lawyer",
  description: "Register a new lawyer in the system",
  tags: ["Lawyers v1"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createLawyerSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.CREATED.statusCode]: {
      description: HttpStatus.CREATED.description,
      content: {
        "application/json": {
          schema: lawyerSingleResponseSchema,
        },
      },
    },
    [HttpStatus.BAD_REQUEST.statusCode]: {
      description: HttpStatus.BAD_REQUEST.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.CONFLICT.statusCode]: {
      description: "Lawyer with this email already exists",
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.INTERNAL_SERVER_ERROR.statusCode]: {
      description: HttpStatus.INTERNAL_SERVER_ERROR.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 4. PUT /v1/lawyers/{id} (Update Lawyer)
lawyersRegistry.registerPath({
  method: "put",
  path: "/v1/lawyers/{id}",
  summary: "Update lawyer profile",
  description: "Update an existing lawyer's information",
  tags: ["Lawyers v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Lawyer's unique identifier",
    },
  ],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createLawyerSchema.partial(),
        },
      },
    },
  },
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: lawyerSingleResponseSchema,
        },
      },
    },
    [HttpStatus.BAD_REQUEST.statusCode]: {
      description: HttpStatus.BAD_REQUEST.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: HttpStatus.NOT_FOUND.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.INTERNAL_SERVER_ERROR.statusCode]: {
      description: HttpStatus.INTERNAL_SERVER_ERROR.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});
