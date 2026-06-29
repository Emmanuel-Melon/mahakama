import { logger } from "@/lib/logger";
import { LLMProviderRegistry } from "@/lib/llm/llm.registry";
import { InferenceStrategyRegistry } from "./inference.registry";
import { findPreference } from "./operations/inference.find";
import type {
  InferenceRunOptions,
  ResolvedInferenceConfig,
} from "./inference.types";
import type { LLMProviderName } from "@/lib/llm/llms.types";

async function resolveConfig(
  strategyKey: string,
  preferredProvider: LLMProviderName,
  defaultModel: string | undefined,
  options: InferenceRunOptions,
): Promise<ResolvedInferenceConfig> {
  // Priority 1: call-time override
  if (options.provider) {
    return { provider: options.provider, model: options.model };
  }

  // Priority 2: persisted user preference
  if (options.userId) {
    const pref = await findPreference(options.userId, strategyKey);
    if (pref.data) {
      return {
        provider: pref.data.provider,
        model: options.model ?? pref.data.model ?? undefined,
      };
    }
  }

  // Priority 3: strategy default
  return {
    provider: preferredProvider,
    model: options.model ?? defaultModel,
  };
}

export const inferenceRouter = {
  async run<TInput, TOutput = string>(
    strategyKey: string,
    input: TInput,
    options: InferenceRunOptions = {},
  ): Promise<TOutput> {
    const strategy = InferenceStrategyRegistry.get<TInput, TOutput>(
      strategyKey,
    );

    const resolved = await resolveConfig(
      strategyKey,
      strategy.preferredProvider,
      strategy.defaultModel,
      options,
    );

    const prompt = strategy.buildPrompt(input);

    const requestConfig = {
      systemPrompt: strategy.systemPrompt,
      outputType: strategy.outputSchema
        ? ("structured" as const)
        : ("text" as const),
      responseSchema: strategy.outputSchema,
      model: resolved.model,
    };

    const execute = async (providerName: LLMProviderName) => {
      const provider = LLMProviderRegistry.get(providerName);
      return provider.generate<TOutput>(prompt, requestConfig);
    };

    let response;
    try {
      response = await execute(resolved.provider);
    } catch (err) {
      if (strategy.fallbackProvider) {
        logger.warn(
          {
            err,
            primary: resolved.provider,
            fallback: strategy.fallbackProvider,
            strategyKey,
          },
          "InferenceRouter: primary provider failed, trying fallback",
        );
        response = await execute(strategy.fallbackProvider);
      } else {
        throw err;
      }
    }

    logger.info(
      {
        strategyKey,
        provider: response.provider,
        model: response.model,
        usage: response.usage,
      },
      "InferenceRouter: request completed",
    );

    if (strategy.parseResponse) {
      return strategy.parseResponse(response);
    }

    return response.content;
  },
};
