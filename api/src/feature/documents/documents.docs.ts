import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { documentsApi } from "./documents.routes";
import { documentInsertSchema, documentSelectSchema } from "./documents.types";

export const documentsRegistry = new OpenAPIRegistry();

const documentApiResource = defineApiResource({
  select: documentSelectSchema,
  insert: documentInsertSchema,
  update: documentInsertSchema.partial(),
});

export const DocumentApiSchemas = registerJsonApiSchemas({
  registry: documentsRegistry,
  resourceType: "document",
  pascalName: "Document",
  schemas: documentApiResource,
});

const documentPaths: PathDefinition[] = [
  {
    handlerName: "getAllDocumentsController",
    method: "get",
    path: documentsApi.path,
    summary: "Get all documents",
    description:
      "Returns a list of all documents with optional filtering and pagination",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: DocumentApiSchemas.colResSchema,
    errorCodes: [401, 500],
  },
  {
    handlerName: "getDocumentByIdController",
    method: "get",
    path: `${documentsApi.path}/{id}`,
    summary: "Get document by ID",
    description: "Retrieve document details by document ID",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: DocumentApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "createDocumentController",
    method: "post",
    path: documentsApi.path,
    summary: "Create a new document",
    description: "Register a new document in the system",
    security: [{ bearerAuth: [] }],
    requestBodySchema: documentInsertSchema,
    successStatus: HttpStatus.CREATED,
    successSchema: DocumentApiSchemas.singleResSchema,
    errorCodes: [400, 401, 500],
  },
  {
    handlerName: "bookmarkDocumentController",
    method: "post",
    path: `${documentsApi.path}/{id}/bookmark`,
    summary: "Bookmark a document",
    description: "Add or remove a bookmark for a document",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.CREATED,
    successSchema: DocumentApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404, 500],
  },
  {
    handlerName: "downloadDocumentController",
    method: "get",
    path: `${documentsApi.path}/{id}/download`,
    summary: "Download a document",
    description: "Increment download count and return document details",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: DocumentApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "ingestDocumentController",
    method: "post",
    path: `${documentsApi.path}/ingest`,
    summary: "Ingest a document with progress updates",
    description:
      "Upload and process a document with real-time progress updates via Server-Sent Events",
    security: [{ bearerAuth: [] }],
    requestBodySchema: z.object({
      file: z.string().openapi({
        format: "binary",
        description: "The document file to upload and process",
      }),
    }),
    successStatus: HttpStatus.SUCCESS,
    successSchema: z.string().openapi({
      format: "binary",
      description:
        "Document ingestion started - SSE stream for progress updates",
    }),
    errorCodes: [400, 401],
  },
];

registerRoutes({
  registry: documentsRegistry,
  defaultTag: "Documents v1",
  routes: documentPaths,
});

documentsRegistry.register("Document", documentSelectSchema);
documentsRegistry.register("CreateDocument", documentInsertSchema);
