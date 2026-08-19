import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { corpusApi } from "./corpus.routes";
import {
  corpusInsertSchema,
  corpusSelectSchema,
  corpusUpdateSchema,
} from "./corpus.types";

export const corpusRegistry = new OpenAPIRegistry();

const corpusApiResource = defineApiResource({
  select: corpusSelectSchema,
  insert: corpusInsertSchema,
  update: corpusUpdateSchema,
});

export const CorpusApiSchemas = registerJsonApiSchemas({
  registry: corpusRegistry,
  resourceType: "corpus",
  pascalName: "Corpus",
  schemas: corpusApiResource,
});

const corpusPaths: PathDefinition[] = [
  {
    handlerName: "getAllCorpusController",
    method: "get",
    path: corpusApi.path,
    summary: "Get all corpus entries",
    description:
      "Returns a list of all corpus entries with optional filtering and pagination",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: CorpusApiSchemas.colResSchema,
    errorCodes: [401, 500],
  },
  {
    handlerName: "getCorpusByIdController",
    method: "get",
    path: `${corpusApi.path}/{id}`,
    summary: "Get corpus entry by ID",
    description: "Retrieve corpus entry details by ID",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: CorpusApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "createCorpusController",
    method: "post",
    path: corpusApi.path,
    summary: "Create a new corpus entry",
    description: "Register a new corpus entry in the system",
    security: [{ bearerAuth: [] }],
    requestBodySchema: corpusInsertSchema,
    successStatus: HttpStatus.CREATED,
    successSchema: CorpusApiSchemas.singleResSchema,
    errorCodes: [400, 401, 500],
  },
  {
    handlerName: "bookmarkCorpusController",
    method: "post",
    path: `${corpusApi.path}/{id}/bookmark`,
    summary: "Bookmark a corpus entry",
    description: "Add or remove a bookmark for a corpus entry",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.CREATED,
    successSchema: CorpusApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404, 500],
  },
  {
    handlerName: "downloadCorpusController",
    method: "get",
    path: `${corpusApi.path}/{id}/download`,
    summary: "Download a corpus entry",
    description: "Increment download count and return corpus entry details",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: CorpusApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "ingestCorpusController",
    method: "post",
    path: `${corpusApi.path}/ingest`,
    summary: "Ingest a corpus entry with progress updates",
    description:
      "Upload and process a corpus entry with real-time progress updates via Server-Sent Events",
    security: [{ bearerAuth: [] }],
    requestBodySchema: z.object({
      file: z.string().openapi({
        format: "binary",
        description: "The corpus file to upload and process",
      }),
    }),
    successStatus: HttpStatus.SUCCESS,
    successSchema: z.string().openapi({
      format: "binary",
      description:
        "Corpus ingestion started - SSE stream for progress updates",
    }),
    errorCodes: [400, 401],
  },
];

registerRoutes({
  registry: corpusRegistry,
  defaultTag: "Corpus v1",
  routes: corpusPaths,
});

corpusRegistry.register("Corpus", corpusSelectSchema);
corpusRegistry.register("CreateCorpus", corpusInsertSchema);
