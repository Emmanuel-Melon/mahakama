import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { serviceSelectSchema, categorySelectSchema } from "./services.types";
import { HttpStatus } from "@/http-status";
import {
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
  createJsonApiCollectionResponseSchema,
} from "@/lib/express/express.serializer";

const ErrorResponseRef = { $ref: "#/components/schemas/JsonApiErrorResponse" };

const legalServiceResourceSchema = createJsonApiResourceSchema(
  "legal-service",
  serviceSelectSchema,
);
const legalServiceSingleResponseSchema = createJsonApiSingleResponseSchema(
  legalServiceResourceSchema,
);
const legalServicesCollectionResponseSchema =
  createJsonApiCollectionResponseSchema(legalServiceResourceSchema);

// Create registry and register schemas
export const servicesRegistry = new OpenAPIRegistry();
servicesRegistry.register("LegalService", serviceSelectSchema);
servicesRegistry.register("ServiceCategory", categorySelectSchema);
servicesRegistry.register("LegalServiceResource", legalServiceResourceSchema);
servicesRegistry.register(
  "LegalServiceSingleResponse",
  legalServiceSingleResponseSchema,
);
servicesRegistry.register(
  "LegalServicesCollectionResponse",
  legalServicesCollectionResponseSchema,
);

// GET /v1/services (Get all legal services)
servicesRegistry.registerPath({
  method: "get",
  path: "/v1/services",
  summary: "Get all legal services",
  description:
    "Returns a list of all available legal services with optional category filtering",
  tags: ["Services v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "category",
      in: "query",
      required: false,
      schema: {
        type: "string",
        enum: ["government", "legal-aid", "dispute-resolution", "specialized"],
      },
      description: "Filter services by category",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: legalServicesCollectionResponseSchema,
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
