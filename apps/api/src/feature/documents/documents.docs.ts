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
import { documentStatusSchema } from "./documents.types";

export const documentsRegistry = new OpenAPIRegistry();

// Define schema for the document status resource
const documentStatusApiResource = defineApiResource({
  select: documentStatusSchema,
  insert: documentStatusSchema,
  update: documentStatusSchema.partial(),
});

export const DocumentStatusApiSchemas = registerJsonApiSchemas({
  registry: documentsRegistry,
  resourceType: "document-status",
  pascalName: "DocumentStatus",
  schemas: documentStatusApiResource,
});

// Define schema for the deletion result response
const documentDeletionResultSchema = z.object({
  sessionId: z.string(),
  deleted: z.boolean(),
  message: z.string(),
});

const documentDeletionApiResource = defineApiResource({
  select: documentDeletionResultSchema,
  insert: documentDeletionResultSchema,
  update: documentDeletionResultSchema.partial(),
});

export const DocumentDeletionApiSchemas = registerJsonApiSchemas({
  registry: documentsRegistry,
  resourceType: "document-deletion",
  pascalName: "DocumentDeletion",
  schemas: documentDeletionApiResource,
});

const documentPaths: PathDefinition[] = [
  {
    handlerName: "getDocumentStatusController",
    method: "get",
    path: `${documentsApi.path}/:sessionId/status`,
    summary: "Get document status",
    description: "Retrieve processing status for a given document session",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: DocumentStatusApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "deleteDocumentController",
    method: "delete",
    path: `${documentsApi.path}/:sessionId`,
    summary: "Delete document",
    description: "Attempt to delete a document by session ID",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: DocumentDeletionApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
];

registerRoutes({
  registry: documentsRegistry,
  defaultTag: "Documents v1",
  routes: documentPaths,
});

documentsRegistry.register("DocumentStatus", documentStatusSchema);
documentsRegistry.register(
  "DocumentDeletionResult",
  documentDeletionResultSchema,
);
