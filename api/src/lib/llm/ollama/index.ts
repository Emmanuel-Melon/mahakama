import { Ollama } from "ollama";
import {
  LLMResponse,
  ILLMProvider,
  BaseLLMOutputConfig,
  GeminiOutputConfig,
} from "../llms.types";
import { llmConfig } from "@/config";
import { logger } from "@/lib/logger";
import { z } from "zod";

export interface OllamaProviderConfig {
  model?: string;
  systemPrompt?: string;
  host?: string;
}

export class OllamaClient implements ILLMProvider<"ollama"> {
  private static instance: OllamaClient;
  private client: Ollama;
  readonly model: string;
  readonly provider: "ollama";
  private _systemPrompt: string;

  private constructor(config: OllamaProviderConfig = {}) {
    this.provider = "ollama";
    this.model = config.model || "gemma3:1b";
    this._systemPrompt = config.systemPrompt || "";

    const ollamaConfig = {
      host: config.host || llmConfig.ollama.url,
    };
    this.client = new Ollama(ollamaConfig);
  }

  public static getInstance(config: OllamaProviderConfig = {}): OllamaClient {
    if (!OllamaClient.instance) {
      OllamaClient.instance = new OllamaClient(config);
    }
    return OllamaClient.instance;
  }

  public get systemPrompt(): string | undefined {
    return this._systemPrompt || undefined;
  }

  public setSystemPrompt(prompt: string): void {
    this._systemPrompt = prompt;
  }

  public getSystemPrompt(): string | undefined {
    return this._systemPrompt || undefined;
  }

  public async generateTextContent<T = string>(
    prompt: string,
    config: GeminiOutputConfig = {},
  ): Promise<LLMResponse<T>> {
    const {
      responseJsonSchema,
      schemaName = "response",
      outputType = "text",
    } = config;

    const messages = [
      ...(this._systemPrompt
        ? [{ role: "system" as const, content: this._systemPrompt }]
        : []),
      { role: "user" as const, content: prompt },
    ];

    const requestOptions: any = {
      model: this.model,
      messages,
      stream: false,
    };

    if (outputType === "structured" && responseJsonSchema) {
      requestOptions.format = "json";

      const response = await this.client.chat({
        model: this.model,
        messages,
        stream: false,
      });
      const content = response.message?.content;

      if (!content) {
        throw new Error("Invalid response from Ollama: no content returned");
      }

      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        throw new Error(`Failed to parse JSON response from Ollama: ${e}`);
      }

      const validatedContent = responseJsonSchema.parse(parsedContent);

      return {
        content: validatedContent as T,
        provider: this.provider,
        contentType: "structured" as const,
      };
    } else {
      console.log("hello");
      const response = await this.client.chat({
        model: this.model,
        messages,
        stream: false,
      });
      console.log("response", response);
      const content = response.message?.content;

      if (!content) {
        throw new Error("Invalid response from Ollama: no content returned");
      }

      return {
        content: content as T,
        provider: this.provider,
        contentType: "text" as const,
      };
    }
  }
}

export const ollamaClient = OllamaClient.getInstance();
