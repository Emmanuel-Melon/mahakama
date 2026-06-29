import { IBaseLLMProvider } from "./llms.types";
import { GeminiClient } from "./gemini";
import { OllamaClient } from "./ollama";
import { llmConfig } from "@/config";
import {
  GeminiModel,
  OllamaModel,
  LLM_PROVIDERS,
  type LLMProviderName,
} from "./llm.config";

interface LLMProviderManagerOptions {
  defaultProvider?: LLMProviderName;
}

export class LLMProviderManager {
  private providers: Map<LLMProviderName, IBaseLLMProvider>;
  private _currentProvider: LLMProviderName;

  constructor(options: LLMProviderManagerOptions = {}) {
    this._currentProvider =
      options.defaultProvider || LLM_PROVIDERS.GEMINI.NAME;
    this.providers = this.initializeProviders(options);
  }

  private initializeProviders(
    options: LLMProviderManagerOptions,
  ): Map<LLMProviderName, IBaseLLMProvider> {
    const providers = new Map<LLMProviderName, IBaseLLMProvider>();

    // Initialize Gemini provider
    if (process.env.GEMINI_API_KEY) {
      const geminiModel = (llmConfig.gemini?.model ||
        LLM_PROVIDERS.GEMINI.DEFAULT_MODEL) as GeminiModel;
      providers.set(
        LLM_PROVIDERS.GEMINI.NAME,
        new GeminiClient({
          apiKey: process.env.GEMINI_API_KEY,
          model: geminiModel,
        }),
      );
    }

    // Initialize Ollama provider
    if (llmConfig.ollama?.url) {
      providers.set(
        LLM_PROVIDERS.OLLAMA.NAME,
        OllamaClient.getInstance({
          host: llmConfig.ollama.url,
          model: (llmConfig.ollama.model ||
            LLM_PROVIDERS.OLLAMA.DEFAULT_MODEL) as OllamaModel,
        }),
      );
    }

    return providers;
  }

  public getClient(provider?: LLMProviderName): IBaseLLMProvider {
    const targetProvider = provider || this._currentProvider;
    const client = this.providers.get(targetProvider);

    if (!client) {
      throw new Error(`No provider found for ${targetProvider}`);
    }
    return client;
  }

  public setProvider(provider: LLMProviderName): void {
    if (!this.providers.has(provider)) {
      throw new Error(`No provider found for ${provider}`);
    }
    this._currentProvider = provider;
  }

  public getCurrentProvider(): LLMProviderName {
    return this._currentProvider;
  }
}

export const llmProviderManager = new LLMProviderManager({
  defaultProvider: LLM_PROVIDERS.OLLAMA.NAME,
});

export const llmClientProvider = llmProviderManager.getClient();
