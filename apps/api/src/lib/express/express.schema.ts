import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Create registry for express schemas
export const expressRegistry = new OpenAPIRegistry();

export const ResponseMetadataSchema = z
  .object({
    timestamp: z
      .string()
      .datetime()
      .optional()
      .describe("ISO 8601 timestamp of the response"),
    requestId: z
      .string()
      .uuid()
      .optional()
      .describe("Unique identifier for the request"),
    resourceId: z
      .union([z.string(), z.number()])
      .optional()
      .describe("Identifier of the resource"),
  })
  .passthrough()
  .openapi({
    description: "Metadata about the response",
    example: {
      timestamp: "2023-12-09T15:39:00Z",
      requestId: "req_12345",
      resourceId: "resource_678",
    },
  });

export const ValidationErrorSchema = z
  .object({
    field: z.string().openapi({
      description: "The field that failed validation",
      example: "email",
    }),
    message: z.string().openapi({
      description: "Description of the validation error",
      example: "Invalid email format",
    }),
    code: z.string().openapi({
      description: "Error code from validator",
      example: "invalid_string",
    }),
  })
  .openapi({
    description: "Validation error detail",
  });

export const JsonApiErrorSchema = z
  .object({
    id: z.string().uuid().describe("Unique identifier for this error instance"),
    status: z.string().describe("HTTP status code as string"),
    code: z.string().describe("Application-specific error code"),
    title: z.string().describe("Short, human-readable summary of the error"),
    detail: z
      .string()
      .describe("Human-readable explanation specific to this error"),
    metadata: ResponseMetadataSchema,
    source: z
      .object({
        pointer: z
          .string()
          .optional()
          .describe("JSON Pointer to the associated entity in request"),
        method: z.string().optional().describe("HTTP method of the request"),
      })
      .optional(),
  })
  .openapi("JsonApiError");

export const JsonApiErrorResponseSchema = z
  .object({
    errors: z.array(JsonApiErrorSchema),
  })
  .openapi("JsonApiErrorResponse");

export const ResponseLinksSchema = z
  .object({
    self: z.string().url().optional().openapi({
      description: "Link to the current resource",
      example: "https://api.example.com/api/v1/users/123",
    }),
    first: z.string().url().optional().openapi({
      description: "Link to the first page",
      example: "https://api.example.com/api/v1/users?page=1",
    }),
    last: z.string().url().optional().openapi({
      description: "Link to the last page",
      example: "https://api.example.com/api/v1/users?page=10",
    }),
    prev: z.string().url().optional().openapi({
      description: "Link to the previous page",
      example: "https://api.example.com/api/v1/users?page=2",
    }),
    next: z.string().url().optional().openapi({
      description: "Link to the next page",
      example: "https://api.example.com/api/v1/users?page=4",
    }),
  })
  .openapi({
    description: "Links related to the response",
  });

export const JsonApiResourceSchema = z
  .object({
    type: z.string(),
    id: z.string(),
    attributes: z.record(z.string(), z.unknown()),
    relationships: z.record(z.string(), z.unknown()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    links: z.record(z.string(), z.string()).optional(),
  })
  .openapi({ description: "JSON:API resource object" });

export const JsonApiResponseSchema = z
  .object({
    data: z.union([JsonApiResourceSchema, z.null()]),
    metadata: ResponseMetadataSchema.optional(),
  })
  .openapi({
    description: "JSON:API single resource response",
    example: {
      data: { id: "123", type: "user", attributes: { name: "John" } },
      meta: { timestamp: "2023-12-09T15:39:00Z", requestId: "req_12345" },
    },
  });

export const JsonApiCollectionResponseSchema = z
  .object({
    data: z.array(JsonApiResourceSchema),
    metadata: ResponseMetadataSchema.optional(),
  })
  .openapi({
    description: "JSON:API collection response",
    example: {
      data: [
        { id: "123", type: "user", attributes: { name: "John" } },
        { id: "456", type: "user", attributes: { name: "Jane" } },
      ],
      meta: { timestamp: "2023-12-09T15:39:00Z", requestId: "req_12345" },
    },
  });

// Register all schemas
expressRegistry.register("ResponseMetadata", ResponseMetadataSchema);
expressRegistry.register("JsonApiError", JsonApiErrorSchema);
expressRegistry.register("JsonApiErrorResponse", JsonApiErrorResponseSchema);
expressRegistry.register("JsonApiResource", JsonApiResourceSchema);
expressRegistry.register("JsonApiResponse", JsonApiResponseSchema);
expressRegistry.register(
  "JsonApiCollectionResponse",
  JsonApiCollectionResponseSchema,
);
// expressRegistry.register('ValidationError', ValidationErrorSchema);
// expressRegistry.register('ResponseLinks', ResponseLinksSchema);

export type ResponseMetadata = z.infer<typeof ResponseMetadataSchema>;
export type ResponseLinks = z.infer<typeof ResponseLinksSchema>;
export type JsonApiError = z.infer<typeof JsonApiErrorSchema>;
export type JsonApiErrorResponse = z.infer<typeof JsonApiErrorResponseSchema>;
