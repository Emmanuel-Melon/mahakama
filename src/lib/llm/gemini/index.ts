import {
  LLMResponse,
  ILLMProvider,
  GeminiOutputConfig,
  GeminiProviderConfig,
} from "../llms.types";
import { GoogleGenAI } from "@google/genai";
import { LLM_PROVIDERS, LLMProviderName } from "../llm.config";

export class GeminiClient implements ILLMProvider<LLMProviderName> {
  private readonly client: GoogleGenAI;
  readonly model: string;
  provider: "gemini";
  private _systemPrompt: string;
  constructor(config: GeminiProviderConfig) {
    this.provider = "gemini";
    const authType = config.authType || LLM_PROVIDERS.GEMINI.AUTH_TYPES.API_KEY;
    if (authType === LLM_PROVIDERS.GEMINI.AUTH_TYPES.VERTEX_AI) {
      this.client = new GoogleGenAI({
        vertexai: true,
        project: config.projectId,
        location: config.location,
        ...(config.apiKey && { apiKey: config.apiKey }),
      });
    } else {
      this.client = new GoogleGenAI({
        apiKey: config.apiKey,
      });
    }

    this.model = config.model || LLM_PROVIDERS.GEMINI.DEFAULT_MODEL;
    this._systemPrompt = config.systemPrompt || "";
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

  public async generateTextContent<T = any>(
    prompt: string,
    config: GeminiOutputConfig = {},
  ): Promise<LLMResponse<T>> {
    const {
      responseJsonSchema,
      schemaName = "response",
      outputType = "text",
    } = config;

    if (outputType === "structured" && responseJsonSchema) {
      const requestConfig: {
        model: string;
        contents: string;
        config?: {
          responseMimeType?: string;
          responseJsonSchema?: any;
        };
      } = {
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: responseJsonSchema,
        },
      };

      const response = await this.client.models.generateContent(requestConfig);
      const content = response?.candidates?.[0]?.content;
      if (!content?.parts?.[0]?.text) {
        throw new Error("Invalid response from Gemini: no content returned");
      }
      const textContent = content.parts[0].text;
      const parsedJson = JSON.parse(textContent);
      const validatedContent = responseJsonSchema.parse(parsedJson);

      return {
        content: validatedContent as T,
        provider: this.provider,
        contentType: "structured" as const,
      };
    } else {
      const requestConfig: {
        model: string;
        contents: string;
      } = {
        model: this.model,
        contents: prompt,
      };
      const response = await this.client.models.generateContent(requestConfig);
      const content = response?.candidates?.[0]?.content;
      if (!content?.parts?.[0]?.text) {
        throw new Error("Invalid response from Gemini: no content returned");
      }
      const textContent = content.parts[0].text;
      return {
        content: textContent as T,
        provider: this.provider,
        contentType: "text" as const,
      };
    }
  }
}
