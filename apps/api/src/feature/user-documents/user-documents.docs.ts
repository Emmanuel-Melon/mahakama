import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { userDocumentsApi } from "./user-documents.routes"; // Adjust to your actual routes file
import { userDocumentStatusSchema } from "./user-documents.types"; // Adjust to your actual types

export const userDocumentsRegistry = new OpenAPIRegistry();

// Define schema for the user document status resource
const userDocumentStatusApiResource = defineApiResource({
  select: userDocumentStatusSchema,
  insert: userDocumentStatusSchema,
  update: userDocumentStatusSchema.partial(),
});

export const UserDocumentStatusApiSchemas = registerJsonApiSchemas({
  registry: userDocumentsRegistry,
  resourceType: "user-document-status",
  pascalName: "UserDocumentStatus",
  schemas: userDocumentStatusApiResource,
});

// Define schema for the deletion result response
const userDocumentDeletionResultSchema = z.object({
  sessionId: z.string(),
  deleted: z.boolean(),
  message: z.string(),
});

const userDocumentDeletionApiResource = defineApiResource({
  select: userDocumentDeletionResultSchema,
  insert: userDocumentDeletionResultSchema,
  update: userDocumentDeletionResultSchema.partial(),
});

export const UserDocumentDeletionApiSchemas = registerJsonApiSchemas({
  registry: userDocumentsRegistry,
  resourceType: "user-document-deletion",
  pascalName: "UserDocumentDeletion",
  schemas: userDocumentDeletionApiResource,
});

const userDocumentPaths: PathDefinition[] = [
  {
    handlerName: "getUserDocumentStatusController",
    method: "get",
    path: `${userDocumentsApi.path}/:sessionId/status`, // Adjust based on your route definition
    summary: "Get user document status",
    description: "Retrieve processing status for a given user document session",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: UserDocumentStatusApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "deleteUserDocumentController",
    method: "delete",
    path: `${userDocumentsApi.path}/:sessionId`, // Adjust based on your route definition
    summary: "Delete user document",
    description: "Attempt to delete a user document by session ID",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: UserDocumentDeletionApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
];

registerRoutes({
  registry: userDocumentsRegistry,
  defaultTag: "User Documents v1",
  routes: userDocumentPaths,
});

userDocumentsRegistry.register("UserDocumentStatus", userDocumentStatusSchema);
userDocumentsRegistry.register(
  "UserDocumentDeletionResult",
  userDocumentDeletionResultSchema,
);
