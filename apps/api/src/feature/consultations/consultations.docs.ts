import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { consultationsApi } from "./consultations.routes";
import {
  consultationSelectSchema,
  createConsultationSchema,
  declineConsultationSchema,
} from "./consultations.types";

export const consultationsRegistry = new OpenAPIRegistry();

const consultationApiResource = defineApiResource({
  select: consultationSelectSchema,
  insert: createConsultationSchema,
  update: z.object({}),
});

export const ConsultationApiSchemas = registerJsonApiSchemas({
  registry: consultationsRegistry,
  resourceType: "consultation",
  pascalName: "Consultation",
  schemas: consultationApiResource,
});

const consultationPaths: PathDefinition[] = [
  {
    handlerName: "getConsultationsController",
    method: "get",
    path: consultationsApi.path,
    summary: "Get all consultations",
    description:
      "Returns a paginated list of consultations with filtering by status, lawyer, or customer.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: ConsultationApiSchemas.colResSchema,
    errorCodes: [401],
  },
  {
    handlerName: "getConsultationController",
    method: "get",
    path: `${consultationsApi.path}/{id}`,
    summary: "Get consultation by ID",
    description: "Retrieve a single consultation's details by ID.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: ConsultationApiSchemas.singleResSchema,
    errorCodes: [401, 404],
  },
  {
    handlerName: "requestConsultationController",
    method: "post",
    path: consultationsApi.path,
    summary: "Request a consultation",
    description:
      "Customer requests a consultation with a lawyer. Creates the consultation in 'pending' status.",
    security: [{ bearerAuth: [] }],
    requestBodySchema: createConsultationSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: ConsultationApiSchemas.singleResSchema,
    errorCodes: [400, 401],
  },
  {
    handlerName: "acceptConsultationController",
    method: "patch",
    path: `${consultationsApi.path}/{id}/accept`,
    summary: "Accept a consultation request",
    description: "Lawyer accepts a pending consultation request.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: ConsultationApiSchemas.singleResSchema,
    errorCodes: [401, 404],
  },
  {
    handlerName: "declineConsultationController",
    method: "patch",
    path: `${consultationsApi.path}/{id}/decline`,
    summary: "Decline a consultation request",
    description:
      "Lawyer declines a pending consultation request, with a reason.",
    security: [{ bearerAuth: [] }],
    requestBodySchema: declineConsultationSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: ConsultationApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404],
  },
  {
    handlerName: "closeConsultationController",
    method: "patch",
    path: `${consultationsApi.path}/{id}/close`,
    summary: "Close a consultation",
    description: "Marks a consultation as closed.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: ConsultationApiSchemas.singleResSchema,
    errorCodes: [401, 404],
  },
];

registerRoutes({
  registry: consultationsRegistry,
  defaultTag: "Consultations v1",
  routes: consultationPaths,
});
