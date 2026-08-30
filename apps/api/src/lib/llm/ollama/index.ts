import { Ollama } from "ollama";
import {
  LLMResponse,
  LLMStreamResponse,
  ILLMProvider,
  BaseLLMOutputConfig,
  GeminiOutputConfig,
  Message,
} from "../llms.types";
import { llmConfig } from "@/config";
import { LLM_PROVIDERS } from "../llm.config";
import { logger } from "@/lib/logger";
import { z } from "zod";

export interface OllamaProviderConfig {
  model?: string;
  systemPrompt?: string;
  host?: string;
}

/**
 * Extracts the first JSON value from a model response that may wrap the JSON
 * in markdown code fences (e.g. ```json ... ```) or include surrounding
 * prose. Falls back to the raw string when no JSON value can be isolated.
 */
function extractJson(raw: string): string {
  const content = raw.trim();

  // Strip a leading markdown code-fence block (e.g. ```json / ```).
  const fenced = content.match(/^```[a-zA-Z]*\s*([\s\S]*?)```\s*$/);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  // Otherwise, try to isolate the first JSON object or array in the output.
  const start = content.search(/[[{]/);
  if (start === -1) {
    return content;
  }
  const open = content[start];
  const close = open === "{" ? "}" : "]";
  const end = content.lastIndexOf(close);
  if (end > start) {
    return content.slice(start, end + 1);
  }

  return content;
}

export class OllamaClient implements ILLMProvider<"ollama"> {
  private static instance: OllamaClient;
  private client: Ollama;
  readonly model: string;
  readonly provider: "ollama";
  private _systemPrompt: string;

  private constructor(config: OllamaProviderConfig = {}) {
    this.provider = "ollama";
    this.model = config.model || LLM_PROVIDERS.OLLAMA.DEFAULT_MODEL;
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

  public async chat(messages: Message[], model: string = this.model) {
    return this.client.chat({ model, messages });
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
        parsedContent = JSON.parse(extractJson(content));
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

  public async generateStreamContent(
    prompt: string,
    onToken: (token: string) => void,
    _config: GeminiOutputConfig = {},
  ): Promise<LLMStreamResponse> {
    const messages = [
      ...(this._systemPrompt
        ? [{ role: "system" as const, content: this._systemPrompt }]
        : []),
      { role: "user" as const, content: prompt },
    ];

    const stream = await this.client.chat({
      model: this.model,
      messages,
      stream: true,
    });

    let fullContent = "";

    for await (const chunk of stream) {
      const token = chunk.message?.content;
      if (token) {
        fullContent += token;
        onToken(token);
      }
    }

    return {
      fullContent,
      provider: this.provider,
      contentType: "text" as const,
    };
  }
}

export const ollamaClient = OllamaClient.getInstance({
  host: llmConfig.ollama.url,
  model: llmConfig.ollama.model || LLM_PROVIDERS.OLLAMA.DEFAULT_MODEL,
});
