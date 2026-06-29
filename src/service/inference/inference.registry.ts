import { logger } from "@/lib/logger";
import type { IInferenceStrategy } from "./inference.types";

const registry = new Map<string, IInferenceStrategy<any, any>>();

export const InferenceStrategyRegistry = {
  register(strategy: IInferenceStrategy<any, any>): void {
    if (registry.has(strategy.key)) {
      logger.warn(
        { key: strategy.key },
        "InferenceStrategyRegistry: strategy already registered — overwriting",
      );
    }
    registry.set(strategy.key, strategy);
    logger.debug({ key: strategy.key }, "Inference strategy registered");
  },

  get<TInput = unknown, TOutput = string>(
    key: string,
  ): IInferenceStrategy<TInput, TOutput> {
    const strategy = registry.get(key);
    if (!strategy) {
      throw new Error(
        `InferenceStrategyRegistry: no strategy registered for key "${key}". ` +
          `Did you forget to import it in inference.bootstrap.ts?`,
      );
    }
    return strategy as IInferenceStrategy<TInput, TOutput>;
  },

  registeredKeys(): string[] {
    return Array.from(registry.keys());
  },
};
