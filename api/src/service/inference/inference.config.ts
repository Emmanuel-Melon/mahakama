import { JsonApiResourceConfig } from "@/lib/express/express.types";
import type {
  InferenceProvider,
  InferencePreference,
  IInferenceStrategy,
} from "./inference.types";

export const SerializedProvider: JsonApiResourceConfig<InferenceProvider> = {
  type: "inference-provider",
  attributes: (provider: InferenceProvider) => provider,
};

export const SerializedPreference: JsonApiResourceConfig<InferencePreference> =
  {
    type: "inference-preference",
    attributes: (preference: InferencePreference) => preference,
  };

export const SerializedStrategy: JsonApiResourceConfig<IInferenceStrategy & { id: string }> = {
  type: "strategy",
  attributes: (strategy) => ({
    key: strategy.key,
    preferredProvider: strategy.preferredProvider,
    fallbackProvider: strategy.fallbackProvider,
    defaultModel: strategy.defaultModel,
  }),
};

export const InferenceJobs = {
  TextGeneration: "text-generation",
  DocumentAnalysis: "document-analysis",
  EmbeddingGeneration: "embedding-generation",
} as const;

export const LLMProviders = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
  GEMINI: "gemini",
  OLLAMA: "ollama",
} as const;

export const InferenceModes = {
  FAST: "fast",
  CHEAP: "cheap",
  BALANCED: "balanced",
  SMART: "smart",
} as const;

export const LLMProviderValues = Object.values(LLMProviders) as [
  string,
  ...string[],
];
export const InferenceModeValues = Object.values(InferenceModes) as [
  string,
  ...string[],
];
