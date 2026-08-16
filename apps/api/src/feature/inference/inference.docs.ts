import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { inferenceApi } from "./inference.routes";
import {
  inferencePreferenceSelectSchema,
  strategySchema,
  inferenceProviderSelectSchema,
  inferenceModelSelectSchema,
  inferencePreferenceInsertSchema,
} from "./inference.types";

export const inferenceRegistry = new OpenAPIRegistry();

const preferenceApiResource = defineApiResource({
  select: inferencePreferenceSelectSchema,
  insert: inferencePreferenceInsertSchema,
  update: inferencePreferenceInsertSchema.partial(),
});

export const PreferenceApiSchemas = registerJsonApiSchemas({
  registry: inferenceRegistry,
  resourceType: "inferencePreference",
  pascalName: "InferencePreference",
  schemas: preferenceApiResource,
});

const providerApiResource = defineApiResource({
  select: inferenceProviderSelectSchema,
  insert: inferenceProviderSelectSchema,
  update: inferenceProviderSelectSchema.partial(),
});

export const ProviderApiSchemas = registerJsonApiSchemas({
  registry: inferenceRegistry,
  resourceType: "provider",
  pascalName: "Provider",
  schemas: providerApiResource,
});

const strategyApiResource = defineApiResource({
  select: strategySchema,
  insert: strategySchema,
  update: strategySchema.partial(),
});

export const StrategyApiSchemas = registerJsonApiSchemas({
  registry: inferenceRegistry,
  resourceType: "strategy",
  pascalName: "Strategy",
  schemas: strategyApiResource,
});

const modelApiResource = defineApiResource({
  select: inferenceModelSelectSchema,
  insert: inferenceModelSelectSchema,
  update: inferenceModelSelectSchema.partial(),
});

export const ModelApiSchemas = registerJsonApiSchemas({
  registry: inferenceRegistry,
  resourceType: "model",
  pascalName: "Model",
  schemas: modelApiResource,
});

const inferencePaths: PathDefinition[] = [
  {
    handlerName: "getUserInferencePreferencesController",
    method: "get",
    path: `${inferenceApi.path}/preferences/{userId}`,
    summary: "Get user inference preferences",
    description: "Retrieve all inference preferences for a specific user",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: PreferenceApiSchemas.colResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "getSpecificInferencePreferenceController",
    method: "get",
    path: `${inferenceApi.path}/preferences/{userId}/{strategyKey}`,
    summary: "Get specific inference preference",
    description:
      "Retrieve a specific inference preference for a user and strategy",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: PreferenceApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "upsertInferencePreferenceController",
    method: "put",
    path: `${inferenceApi.path}/preferences/{userId}/{strategyKey}`,
    summary: "Create or update inference preference",
    description:
      "Create a new preference or update existing preference for a user and strategy",
    security: [{ bearerAuth: [] }],
    requestBodySchema: z.object({
      provider: z.enum(["geminit", "ollama", "claude"]),
      model: z.string().optional(),
    }),
    successStatus: HttpStatus.SUCCESS,
    successSchema: PreferenceApiSchemas.singleResSchema,
    errorCodes: [400, 401, 500],
  },
  {
    handlerName: "disableInferencePreferenceController",
    method: "put",
    path: `${inferenceApi.path}/preferences/{userId}/{strategyKey}`,
    summary: "Disable inference preference",
    description:
      "Disables a specific inference preference, resetting to strategy default",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: z.object({ data: z.null() }),
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "getAvailableProvidersController",
    method: "get",
    path: `${inferenceApi.path}/providers`,
    summary: "Get available LLM providers",
    description:
      "Retrieve all registered LLM providers and their default models",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: ProviderApiSchemas.colResSchema,
    errorCodes: [401, 500],
  },
  {
    handlerName: "getAvailableStrategiesController",
    method: "get",
    path: `${inferenceApi.path}/strategies`,
    summary: "Get available inference strategies",
    description:
      "Retrieve all registered inference strategy keys that can be configured",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: StrategyApiSchemas.colResSchema,
    errorCodes: [401, 500],
  },
];

registerRoutes({
  registry: inferenceRegistry,
  defaultTag: "Inference v1",
  routes: inferencePaths,
});

inferenceRegistry.register(
  "InferencePreference",
  inferencePreferenceSelectSchema,
);
inferenceRegistry.register("Provider", inferenceProviderSelectSchema);
inferenceRegistry.register("Strategy", strategySchema);
inferenceRegistry.register("Model", inferenceModelSelectSchema);
