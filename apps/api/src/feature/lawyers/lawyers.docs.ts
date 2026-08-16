import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { lawyersApi } from "./lawyer.routes";
import { lawyerSelectSchema, createLawyerSchema } from "./lawyers.types";

export const lawyersRegistry = new OpenAPIRegistry();

const lawyerApiResource = defineApiResource({
  select: lawyerSelectSchema,
  insert: createLawyerSchema,
  update: createLawyerSchema.partial(),
});

export const LawyerApiSchemas = registerJsonApiSchemas({
  registry: lawyersRegistry,
  resourceType: "lawyer",
  pascalName: "Lawyer",
  schemas: lawyerApiResource,
});

const lawyerPaths: PathDefinition[] = [
  {
    handlerName: "getAllLawyersController",
    method: "get",
    path: lawyersApi.path,
    summary: "Get all lawyers",
    description:
      "Returns a list of all registered lawyers with optional filtering and pagination",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: LawyerApiSchemas.colResSchema,
    errorCodes: [401, 500],
  },
  {
    handlerName: "getLawyerByIdController",
    method: "get",
    path: `${lawyersApi.path}/{id}`,
    summary: "Get lawyer by ID",
    description: "Retrieve lawyer details by lawyer ID",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: LawyerApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "createLawyerController",
    method: "post",
    path: lawyersApi.path,
    summary: "Create a new lawyer",
    description: "Register a new lawyer in the system",
    security: [{ bearerAuth: [] }],
    requestBodySchema: createLawyerSchema,
    successStatus: HttpStatus.CREATED,
    successSchema: LawyerApiSchemas.singleResSchema,
    errorCodes: [400, 401, 409, 500],
  },
  {
    handlerName: "updateLawyerController",
    method: "put",
    path: `${lawyersApi.path}/{id}`,
    summary: "Update lawyer profile",
    description: "Update an existing lawyer's information",
    security: [{ bearerAuth: [] }],
    requestBodySchema: createLawyerSchema.partial(),
    successStatus: HttpStatus.SUCCESS,
    successSchema: LawyerApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404, 500],
  },
];

registerRoutes({
  registry: lawyersRegistry,
  defaultTag: "Lawyers v1",
  routes: lawyerPaths,
});

lawyersRegistry.register("Lawyer", lawyerSelectSchema);
lawyersRegistry.register("CreateLawyer", createLawyerSchema);
