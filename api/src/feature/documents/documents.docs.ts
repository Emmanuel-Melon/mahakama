import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { documentInsertSchema, documentSelectSchema } from "./documents.types";
import { HttpStatus } from "@/http-status";
import {
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
  createJsonApiCollectionResponseSchema,
} from "@/lib/express/express.serializer";

const ErrorResponseRef = { $ref: "#/components/schemas/JsonApiErrorResponse" };
const documentResourceSchema = createJsonApiResourceSchema(
  "document",
  documentSelectSchema,
);
const documentSingleResponseSchema = createJsonApiSingleResponseSchema(
  documentResourceSchema,
);
const documentsCollectionResponseSchema = createJsonApiCollectionResponseSchema(
  documentResourceSchema,
);

// Create registry and register schemas
export const documentsRegistry = new OpenAPIRegistry();
documentsRegistry.register("Document", documentSelectSchema);
documentsRegistry.register("CreateDocument", documentInsertSchema);
documentsRegistry.register("DocumentResource", documentResourceSchema);
documentsRegistry.register(
  "DocumentSingleResponse",
  documentSingleResponseSchema,
);
documentsRegistry.register(
  "DocumentsCollectionResponse",
  documentsCollectionResponseSchema,
);

// 1. GET /v1/documents (Get All Documents)
documentsRegistry.registerPath({
  method: "get",
  path: "/v1/documents",
  summary: "Get all documents",
  description:
    "Returns a list of all documents with optional filtering and pagination",
  tags: ["Documents v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "type",
      in: "query",
      required: false,
      schema: { type: "string" },
      description: "Filter documents by type",
    },
    {
      name: "limit",
      in: "query",
      required: false,
      schema: { type: "integer", default: 10 },
      description: "Number of documents per page",
    },
    {
      name: "offset",
      in: "query",
      required: false,
      schema: { type: "integer", default: 0 },
      description: "Number of documents to skip",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: documentsCollectionResponseSchema,
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

// 2. GET /v1/documents/{id} (Get Document by ID)
documentsRegistry.registerPath({
  method: "get",
  path: "/v1/documents/{id}",
  summary: "Get document by ID",
  description: "Retrieve document details by document ID",
  tags: ["Documents v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Document's unique identifier",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: documentSingleResponseSchema,
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

// 3. POST /v1/documents (Create a new document)
documentsRegistry.registerPath({
  method: "post",
  path: "/v1/documents",
  summary: "Create a new document",
  description: "Register a new document in the system",
  tags: ["Documents v1"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: documentInsertSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.CREATED.statusCode]: {
      description: HttpStatus.CREATED.description,
      content: {
        "application/json": {
          schema: documentSingleResponseSchema,
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

// 4. POST /v1/documents/{id}/bookmark (Bookmark Document)
documentsRegistry.registerPath({
  method: "post",
  path: "/v1/documents/{id}/bookmark",
  summary: "Bookmark a document",
  description: "Add or remove a bookmark for a document",
  tags: ["Documents v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Document's unique identifier",
    },
  ],
  responses: {
    [HttpStatus.CREATED.statusCode]: {
      description: HttpStatus.CREATED.description,
      content: {
        "application/json": {
          schema: documentSingleResponseSchema,
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

// 5. GET /v1/documents/{id}/download (Download Document)
documentsRegistry.registerPath({
  method: "get",
  path: "/v1/documents/{id}/download",
  summary: "Download a document",
  description: "Increment download count and return document details",
  tags: ["Documents v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Document's unique identifier",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: documentSingleResponseSchema,
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

// 6. POST /v1/documents/ingest (Ingest Document with SSE)
documentsRegistry.registerPath({
  method: "post",
  path: "/v1/documents/ingest",
  summary: "Ingest a document with progress updates",
  description:
    "Upload and process a document with real-time progress updates via Server-Sent Events",
  tags: ["Documents v1"],
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          required: ["file"],
          properties: {
            file: {
              type: "string",
              format: "binary",
              description: "The document file to upload and process",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description:
        "Document ingestion started - SSE stream for progress updates",
      content: {
        "text/event-stream": {
          schema: {
            type: "string",
            format: "binary",
          },
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
  },
});
