import { HttpStatus, StatusConfig } from "@/http-status";

export type LlmErrorCode =
  | "CONTEXT_WINDOW_EXCEEDED"
  | "RATE_LIMIT_REACHED"
  | "SAFETY_VIOLATION"
  | "INVALID_MODEL"
  | "INSUFFICIENT_QUOTA";

export interface LlmErrorConfig extends StatusConfig {
  code: LlmErrorCode;
}

export const LlmErrors: Record<LlmErrorCode, LlmErrorConfig> = {
  CONTEXT_WINDOW_EXCEEDED: {
    ...HttpStatus.BAD_REQUEST,
    code: "CONTEXT_WINDOW_EXCEEDED",
    description: "The input tokens exceed the model's capacity. ",
  },
  RATE_LIMIT_REACHED: {
    ...HttpStatus.TOO_MANY_REQUESTS,
    code: "RATE_LIMIT_REACHED",
    description: "You have sent too many requests in a short period.",
  },
  SAFETY_VIOLATION: {
    ...HttpStatus.FORBIDDEN,
    code: "SAFETY_VIOLATION",
    description: "The prompt or output triggered safety filters.",
  },
  INVALID_MODEL: {
    ...HttpStatus.NOT_FOUND,
    code: "INVALID_MODEL",
    description:
      "The requested model version does not exist or is unsupported.",
  },
  INSUFFICIENT_QUOTA: {
    ...HttpStatus.PAYMENT_REQUIRED,
    code: "INSUFFICIENT_QUOTA",
    description: "You have exceeded your credit limit or quota.",
  },
} as const;

export const LLM_PROVIDERS = {
  GEMINI: {
    NAME: "gemini" as const,
    AUTH_TYPES: {
      API_KEY: "api_key",
      VERTEX_AI: "vertexai",
    },
    MODELS: {
      GEMINI_2_5_PRO: "gemini-2.5-pro",
      GEMINI_2_5_FLASH: "gemini-2.5-flash",
      GEMINI_1_5_PRO: "gemini-1.5-pro",
      GEMINI_1_5_FLASH: "gemini-1.5-flash",
    },
    DEFAULT_MODEL: "gemini-2.5-flash",
  },
  OLLAMA: {
    NAME: "ollama" as const,
    MODELS: {
      GEMMA3_1B: "gemma3:1b",
    },
    DEFAULT_MODEL: "gemma3:1b",
  },
} as const;

export type LLMProviderName =
  (typeof LLM_PROVIDERS)[keyof typeof LLM_PROVIDERS]["NAME"];
export type GeminiModel =
  (typeof LLM_PROVIDERS.GEMINI.MODELS)[keyof typeof LLM_PROVIDERS.GEMINI.MODELS];
export type OllamaModel =
  (typeof LLM_PROVIDERS.OLLAMA.MODELS)[keyof typeof LLM_PROVIDERS.OLLAMA.MODELS];
export type LLMModel = GeminiModel | OllamaModel;
export type GeminiAuthType =
  (typeof LLM_PROVIDERS.GEMINI.AUTH_TYPES)[keyof typeof LLM_PROVIDERS.GEMINI.AUTH_TYPES];
