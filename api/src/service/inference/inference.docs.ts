import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { HttpStatus } from "@/lib/http/http.status";
import {
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
  createJsonApiCollectionResponseSchema,
} from "@/lib/express/express.serializer";
import {
  inferencePreferenceSelectSchema,
  strategySchema,
  inferenceProviderSelectSchema,
  inferenceModelSelectSchema,
} from "./inference.types";

const preferenceResourceSchema = createJsonApiResourceSchema(
  "inferencePreference",
  inferencePreferenceSelectSchema,
);
const providerResourceSchema = createJsonApiResourceSchema(
  "provider",
  inferenceProviderSelectSchema,
);
const strategyResourceSchema = createJsonApiResourceSchema(
  "strategy",
  strategySchema,
);
const modelResourceSchema = createJsonApiResourceSchema('model', inferenceModelSelectSchema)

const preferenceSingleResponseSchema = createJsonApiSingleResponseSchema(
  preferenceResourceSchema,
);
const preferenceCollectionResponseSchema =
  createJsonApiCollectionResponseSchema(preferenceResourceSchema);
const providerCollectionResponseSchema = createJsonApiCollectionResponseSchema(
  providerResourceSchema,
);
const strategyCollectionResponseSchema = createJsonApiCollectionResponseSchema(
  strategyResourceSchema,
);
const modelCollectionResponseSchema = createJsonApiCollectionResponseSchema(
  modelResourceSchema,
);

// Error response reference
const ErrorResponseRef = { $ref: "#/components/schemas/JsonApiErrorResponse" };

// Create registry and register schemas
export const inferenceRegistry = new OpenAPIRegistry();
inferenceRegistry.register("InferencePreference", inferencePreferenceSelectSchema);
inferenceRegistry.register(
  "InferencePreferenceResource",
  preferenceResourceSchema,
);
inferenceRegistry.register(
  "InferencePreferenceSingleResponse",
  preferenceSingleResponseSchema,
);
inferenceRegistry.register(
  "InferencePreferenceCollectionResponse",
  preferenceCollectionResponseSchema,
);
inferenceRegistry.register("Provider", inferenceProviderSelectSchema);
inferenceRegistry.register("ProviderResource", providerResourceSchema);
inferenceRegistry.register(
  "ProviderCollectionResponse",
  providerCollectionResponseSchema,
);
inferenceRegistry.register("Strategy", strategySchema);
inferenceRegistry.register("StrategyResource", strategyResourceSchema);
inferenceRegistry.register(
  "StrategyCollectionResponse",
  strategyCollectionResponseSchema,
);
inferenceRegistry.register("Model", inferenceModelSelectSchema);
inferenceRegistry.register("ModelResource", modelResourceSchema);
inferenceRegistry.register(
  "ModelCollectionResponse",
  modelCollectionResponseSchema,
);

// 1. GET /v1/inference/preferences/:userId (Get User Preferences)
inferenceRegistry.registerPath({
  method: "get",
  path: "/v1/inference/preferences/{userId}",
  summary: "Get user inference preferences",
  description: "Retrieve all inference preferences for a specific user",
  tags: ["Inference v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "userId",
      in: "path",
      required: true,
      schema: { type: "string", format: "uuid" },
      description: "User ID",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: preferenceCollectionResponseSchema,
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
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: HttpStatus.NOT_FOUND.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 2. GET /v1/inference/preferences/:userId/:strategyKey (Get Specific Preference)
inferenceRegistry.registerPath({
  method: "get",
  path: "/v1/inference/preferences/{userId}/{strategyKey}",
  summary: "Get specific inference preference",
  description:
    "Retrieve a specific inference preference for a user and strategy",
  tags: ["Inference v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "userId",
      in: "path",
      required: true,
      schema: { type: "string", format: "uuid" },
      description: "User ID",
    },
    {
      name: "strategyKey",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Strategy key (e.g., 'chat', 'qa', 'recommendations')",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: preferenceSingleResponseSchema,
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
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: "No preference found for this strategy",
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 3. PUT /v1/inference/preferences/:userId/:strategyKey (Upsert Preference)
inferenceRegistry.registerPath({
  method: "put",
  path: "/v1/inference/preferences/{userId}/{strategyKey}",
  summary: "Create or update inference preference",
  description:
    "Create a new preference or update existing preference for a user and strategy",
  tags: ["Inference v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "userId",
      in: "path",
      required: true,
      schema: { type: "string", format: "uuid" },
      description: "User ID",
    },
    {
      name: "strategyKey",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Strategy key (e.g., 'chat', 'qa', 'recommendations')",
    },
  ],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z.object({
            provider: z.enum(["gemini", "ollama", "claude"]),
            model: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: preferenceSingleResponseSchema,
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
    [HttpStatus.BAD_REQUEST.statusCode]: {
      description: "Invalid provider or strategy key",
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 4. PUT  /v1/inference/preferences/:userId/:strategyKey (Disable Preference)
inferenceRegistry.registerPath({
  method: "put",
  path: "/v1/inference/preferences/{userId}/{strategyKey}",
  summary: "Disable inference preference",
  description:
    "Disables a specific inference preference, resetting to strategy default",
  tags: ["Inference v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "userId",
      in: "path",
      required: true,
      schema: { type: "string", format: "uuid" },
      description: "User ID",
    },
    {
      name: "strategyKey",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Strategy key to disable",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: createJsonApiSingleResponseSchema(
            z.object({ data: z.null() }),
          ),
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
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: "No preference found for this strategy",
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 5. GET /v1/inference/providers (Get Available Providers)
inferenceRegistry.registerPath({
  method: "get",
  path: "/v1/inference/providers",
  summary: "Get available LLM providers",
  description: "Retrieve all registered LLM providers and their default models",
  tags: ["Inference v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: providerCollectionResponseSchema,
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
  },
});

// 6. GET /v1/inference/strategies (Get Available Strategies)
inferenceRegistry.registerPath({
  method: "get",
  path: "/v1/inference/strategies",
  summary: "Get available inference strategies",
  description:
    "Retrieve all registered inference strategy keys that can be configured",
  tags: ["Inference v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: strategyCollectionResponseSchema,
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
  },
});
