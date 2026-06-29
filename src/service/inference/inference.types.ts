import { z } from "zod";
import type { LLMResponse, LLMProviderName } from "@/lib/llm/llms.types";
import {
  inferenceProvidersSchema,
  inferenceModelsSchema,
  userInferencePreferencesSchema,
} from "./inference.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * INFERENCE STRATEGY
 */
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

/**
 * RUN OPTIONS
 */
export interface InferenceRunOptions {
  provider?: LLMProviderName; // call-time override — highest priority
  model?: string; // call-time model override
  userId?: string; // used to load persisted user preferences
}

/**
 * RESOLVED CONFIG
 */
export interface ResolvedInferenceConfig {
  provider: LLMProviderName;
  model?: string;
}

export const strategySchema = z.object({
  key: z.string(),
});

export interface ChatInput {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

/**
 *  DOMAIN types
 */
export const inferencePreferenceInsertSchema = createInsertSchema(
  userInferencePreferencesSchema,
);
export const inferencePreferenceSelectSchema = createSelectSchema(
  userInferencePreferencesSchema,
);

export const inferenceProviderSelectSchema = createSelectSchema(
  inferenceProvidersSchema,
);
export const inferenceProviderInsertSchema = createInsertSchema(
  inferenceProvidersSchema,
);

export const inferenceModelSelectSchema = createSelectSchema(
  inferenceModelsSchema,
);
export const inferenceModelInsertSchema = createInsertSchema(
  inferenceModelsSchema,
);

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
