import { z } from "zod";
import type { LLMResponse } from "@/lib/llm/llms.types";
import type { LLMProviderName } from "@/lib/llm/llm.config";
import { InferenceJobs } from "./inference.config";
import {
  inferenceProvidersSchema,
  inferenceModelsSchema,
  userInferencePreferencesSchema,
} from "./inference.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { crudMeta } from "@/lib/openapi/openapi.utils";

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

const basePreferenceInsert = createInsertSchema(userInferencePreferencesSchema);
const basePreferenceSelect = createSelectSchema(userInferencePreferencesSchema);

export const inferencePreferenceInsertSchema = crudMeta(
  basePreferenceInsert,
  "insert",
  "InferencePreference",
);

export const inferencePreferenceSelectSchema = crudMeta(
  basePreferenceSelect,
  "select",
  "InferencePreference",
);

const baseProviderSelect = createSelectSchema(inferenceProvidersSchema);
const baseProviderInsert = createInsertSchema(inferenceProvidersSchema);

export const inferenceProviderSelectSchema = crudMeta(
  baseProviderSelect,
  "select",
  "InferenceProvider",
);

export const inferenceProviderInsertSchema = crudMeta(
  baseProviderInsert,
  "insert",
  "InferenceProvider",
);

const baseModelSelect = createSelectSchema(inferenceModelsSchema);
const baseModelInsert = createInsertSchema(inferenceModelsSchema);

export const inferenceModelSelectSchema = crudMeta(
  baseModelSelect,
  "select",
  "InferenceModel",
);

export const inferenceModelInsertSchema = crudMeta(
  baseModelInsert,
  "insert",
  "InferenceModel",
);

export const strategySchema = z.object({
  key: z.string(),
});

/*
 * DOMAIN-RELATED TYPES
 */

export type InferencePreference = z.infer<
  typeof inferencePreferenceSelectSchema
>;
export type NewInferencePreference = z.infer<
  typeof inferencePreferenceInsertSchema
>;

export type InferenceProvider = z.infer<typeof inferenceProviderSelectSchema>;
export type NewInferenceProvider = z.infer<
  typeof inferenceProviderInsertSchema
>;

export type InferenceModel = z.infer<typeof inferenceModelSelectSchema>;
export type NewInferenceModel = z.infer<typeof inferenceModelInsertSchema>;

export interface IInferenceStrategy<TInput = unknown, TOutput = string> {
  readonly key: string;
  readonly preferredProvider: LLMProviderName;
  readonly fallbackProvider?: LLMProviderName;
  readonly systemPrompt?: string;
  readonly defaultModel?: string;
  readonly outputSchema?: z.ZodType<TOutput>;

  buildPrompt(input: TInput): string;
  parseResponse?(raw: LLMResponse<TOutput>): TOutput;
}

export interface InferenceRunOptions {
  provider?: LLMProviderName; // call-time override — highest priority
  model?: string; // call-time model override
  userId?: string; // used to load persisted user preferences
}

export interface ResolvedInferenceConfig {
  provider: LLMProviderName;
  model?: string;
}

export interface ChatInput {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

/*
 * DATABASE QUERY TYPES
 */

export type InferencePreferenceColumn =
  typeof userInferencePreferencesSchema._.columns;
export type InferencePreferenceColumnKey = keyof InferencePreferenceColumn;

export type InferenceProviderColumn = typeof inferenceProvidersSchema._.columns;
export type InferenceProviderColumnKey = keyof InferenceProviderColumn;

export type InferenceModelColumn = typeof inferenceModelsSchema._.columns;
export type InferenceModelColumnKey = keyof InferenceModelColumn;

/*
 * QUEUE-RELATED TYPES
 */

export const TextGenerationPayloadSchema = z.object({
  prompt: z.string(),
  userId: z.string(),
  sessionId: z.string().optional(),
  model: z.string().optional(),
  maxTokens: z.number().optional(),
});

export type TextGenerationPayload = z.infer<typeof TextGenerationPayloadSchema>;

export interface InferenceJobMap {
  [InferenceJobs.TextGeneration]: TextGenerationPayload;
}
