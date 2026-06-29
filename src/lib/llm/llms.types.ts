import { z } from "zod";
import {
  GeminiModel,
  GeminiAuthType,
  type LLMProviderName,
} from "./llm.config";

export type MessageRole = "system" | "user" | "assistant" | "function";

export type LLMOutputType = "text" | "structured";

export interface BaseLLMOutputConfig {
  responseJsonSchema?: z.ZodTypeAny;
  schemaName?: string;
  outputType?: LLMOutputType;
  provider?: LLMProviderName;
  model?: string;
}

export interface GeminiOutputConfig extends BaseLLMOutputConfig {
  responseMimeType?: string;
}

export interface GeminiProviderConfig {
  projectId?: string;
  location?: string;
  apiKey?: string;
  model?: GeminiModel;
  systemPrompt?: string;
  authType?: GeminiAuthType;
}

export interface ILLMProvider<TProvider extends LLMProviderName> {
  provider: TProvider;
  model?: string;
  systemPrompt?: string;

  generateTextContent<T = string>(
    prompt: string,
    config?: GeminiOutputConfig,
  ): Promise<LLMResponse<T>>;

  setSystemPrompt(systemPrompt: string): void;
  getSystemPrompt(): string | undefined;
}

export interface IBaseLLMProvider {
  provider?: LLMProviderName;
  model?: string;
  systemPrompt?: string;
  generateTextContent<T = string>(
    prompt: string,
    config?: GeminiOutputConfig,
  ): Promise<LLMResponse<T>>;
  setSystemPrompt(systemPrompt: string): void;
  getSystemPrompt(): string | undefined;
}

export interface IllmClientProvider extends ILLMProvider<LLMProviderName> {
  setProvider(provider: LLMProviderName): void;
}

export interface Message {
  role: MessageRole;
  content: string;
  name?: string;
}
export interface LLMResponse<T = any> {
  content: T;
  provider: LLMProviderName;
  contentType: "text" | "structured";
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
