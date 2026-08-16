import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { servicesApi } from "./services.routes";
import {
  serviceSelectSchema,
  categorySelectSchema,
  serviceInsertSchema,
} from "./services.types";

export const servicesRegistry = new OpenAPIRegistry();

const legalServiceApiResource = defineApiResource({
  select: serviceSelectSchema,
  insert: serviceInsertSchema,
});

export const LegalServiceApiSchemas = registerJsonApiSchemas({
  registry: servicesRegistry,
  resourceType: "legal-service",
  pascalName: "LegalService",
  schemas: legalServiceApiResource,
});

const servicePaths: PathDefinition[] = [
  {
    handlerName: "getAllLegalServicesController",
    method: "get",
    path: servicesApi.path,
    summary: "Get all legal services",
    description:
      "Returns a list of all available legal services with optional category filtering",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: LegalServiceApiSchemas.colResSchema,
    errorCodes: [401, 500],
  },
];

registerRoutes({
  registry: servicesRegistry,
  defaultTag: "Services v1",
  routes: servicePaths,
});

servicesRegistry.register("LegalService", serviceSelectSchema);
servicesRegistry.register("ServiceCategory", categorySelectSchema);
