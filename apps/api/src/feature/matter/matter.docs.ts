import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { matterApi } from "./matter.routes";
import {
  matterInsertSchema,
  matterSelectSchema,
  matterUpdateSchema,
  matterNoteInsertSchema,
  matterNoteSelectSchema,
  matterNoteUpdateSchema,
  matterLawyerInsertSchema,
  matterLawyerSelectSchema,
  matterLawyerUpdateSchema,
  matterDocumentInsertSchema,
  matterDocumentSelectSchema,
  matterDocumentUpdateSchema,
} from "./matter.types";

export const matterRegistry = new OpenAPIRegistry();

const matterApiResource = defineApiResource({
  select: matterSelectSchema,
  insert: matterInsertSchema,
  update: matterUpdateSchema,
});

export const MatterApiSchemas = registerJsonApiSchemas({
  registry: matterRegistry,
  resourceType: "matter",
  pascalName: "Matter",
  schemas: matterApiResource,
});

const matterNoteApiResource = defineApiResource({
  select: matterNoteSelectSchema,
  insert: matterNoteInsertSchema,
  update: matterNoteUpdateSchema,
});

export const MatterNoteApiSchemas = registerJsonApiSchemas({
  registry: matterRegistry,
  resourceType: "matter-note",
  pascalName: "MatterNote",
  schemas: matterNoteApiResource,
});

const matterLawyerApiResource = defineApiResource({
  select: matterLawyerSelectSchema,
  insert: matterLawyerInsertSchema,
  update: matterLawyerUpdateSchema,
});

export const MatterLawyerApiSchemas = registerJsonApiSchemas({
  registry: matterRegistry,
  resourceType: "matter-lawyer",
  pascalName: "MatterLawyer",
  schemas: matterLawyerApiResource,
});

const matterDocumentApiResource = defineApiResource({
  select: matterDocumentSelectSchema,
  insert: matterDocumentInsertSchema,
  update: matterDocumentUpdateSchema,
});

export const MatterDocumentApiSchemas = registerJsonApiSchemas({
  registry: matterRegistry,
  resourceType: "matter-document",
  pascalName: "MatterDocument",
  schemas: matterDocumentApiResource,
});

const matterPaths: PathDefinition[] = [
  {
    handlerName: "getMattersController",
    method: "get",
    path: matterApi.path,
    summary: "Get all matters",
    description: "Returns a list of matters with filtering and sorting options",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: MatterApiSchemas.colResSchema,
    errorCodes: [401, 403],
  },
  {
    handlerName: "getMatterController",
    method: "get",
    path: `${matterApi.path}/{id}`,
    summary: "Get matter by ID",
    description:
      "Retrieve matter details by matter ID along with related information.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: MatterApiSchemas.singleResSchema,
    errorCodes: [401, 403, 404],
  },
  {
    handlerName: "getMatterTimelineController",
    method: "get",
    path: `${matterApi.path}/{matterId}/timeline`,
    summary: "Get matter timeline",
    description:
      "Retrieve the chronological timeline of events and status changes for a specific matter.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: z.object({
      data: z.array(z.any()),
      meta: z.object({ total: z.number() }).optional(),
    }),
    errorCodes: [401, 403, 404],
  },
  {
    handlerName: "openMatterController",
    method: "post",
    path: matterApi.path,
    summary: "Open a new matter",
    description: "Create and open a new matter record for a client.",
    security: [{ bearerAuth: [] }],
    requestBodySchema: matterInsertSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: MatterApiSchemas.singleResSchema,
    errorCodes: [400, 401],
  },
  {
    handlerName: "addNoteController",
    method: "post",
    path: `${matterApi.path}/{matterId}/notes`,
    summary: "Create a matter note",
    description: "Add a new note to a specific matter.",
    security: [{ bearerAuth: [] }],
    requestBodySchema: matterNoteInsertSchema.omit({
      matterId: true,
      authorUserId: true,
    }),
    successStatus: HttpStatus.CREATED,
    successSchema: MatterNoteApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404],
  },
  {
    handlerName: "getMatterNotesController",
    method: "get",
    path: `${matterApi.path}/{matterId}/notes`,
    summary: "Get matter notes",
    description:
      "List notes for a matter. Internal notes are only returned to lawyers.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: MatterNoteApiSchemas.colResSchema,
    errorCodes: [401, 403, 404],
  },
  {
    handlerName: "getMatterDocumentsController",
    method: "get",
    path: `${matterApi.path}/{matterId}/documents`,
    summary: "Get matter documents",
    description: "List the documents attached to a specific matter.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: MatterDocumentApiSchemas.colResSchema,
    errorCodes: [401, 403, 404],
  },
  {
    handlerName: "updateMatterController",
    method: "patch",
    path: `${matterApi.path}/{matterId}`,
    summary: "Update an existing matter",
    description: "Update details of a specific matter by ID.",
    security: [{ bearerAuth: [] }],
    requestBodySchema: matterUpdateSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: MatterApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404],
  },
  {
    handlerName: "getMatterLawyersController",
    method: "get",
    path: `${matterApi.path}/{matterId}/lawyers`,
    summary: "Get matter lawyers",
    description: "List the lawyers assigned or invited to a specific matter.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: MatterLawyerApiSchemas.colResSchema,
    errorCodes: [401, 403, 404],
  },
  {
    handlerName: "createMatterLawyerController",
    method: "post",
    path: `${matterApi.path}/{matterId}/lawyers`,
    summary: "Assign a lawyer to a matter",
    description: "Link a lawyer to a specific matter with a defined role.",
    security: [{ bearerAuth: [] }],
    requestBodySchema: matterLawyerInsertSchema.omit({ matterId: true }),
    successStatus: HttpStatus.CREATED,
    successSchema: MatterLawyerApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404],
  },
  {
    handlerName: "updateMatterLawyerMeController",
    method: "patch",
    path: `${matterApi.path}/{matterId}/lawyers/me`,
    summary: "Update current lawyer's assignment status on a matter",
    description:
      "Allows the authenticated lawyer to update their assignment details or status on a specific matter.",
    security: [{ bearerAuth: [] }],
    requestBodySchema: matterLawyerUpdateSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: MatterLawyerApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404],
  },
];

registerRoutes({
  registry: matterRegistry,
  defaultTag: "Matters v1",
  routes: matterPaths,
});

matterRegistry.register("Matter", matterSelectSchema);
matterRegistry.register("NewMatter", matterInsertSchema);
matterRegistry.register("UpdateMatter", matterUpdateSchema);
matterRegistry.register("MatterNote", matterNoteSelectSchema);
matterRegistry.register("NewMatterNote", matterNoteInsertSchema);
matterRegistry.register("MatterDocument", matterDocumentSelectSchema);
matterRegistry.register("NewMatterDocument", matterDocumentInsertSchema);
