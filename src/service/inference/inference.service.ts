import {
  ModelRegistry,
  LLMProviderRegistry,
  InputRegistry,
  OutputRegistry,
} from "@/lib/llm/llm.registry";
import { LLMRequest, LLMResponse } from "@/lib/llm/llms.types";

export class InferenceService {
  static async generate<T = unknown>(
    request: LLMRequest,
  ): Promise<LLMResponse<T>> {
    // 1. Resolve model
    const modelConfig = request.model
      ? ModelRegistry[request.model]
      : ModelRegistry["gpt-4o"];

    if (!modelConfig) {
      throw new Error(`Unknown model: ${request.model}`);
    }

    // 2. Resolve provider
    const provider =
      LLMProviderRegistry[request.provider || modelConfig.provider];

    // 3. Process input
    const inputProcessor = InputRegistry[request.inputType];
    const processedInput = inputProcessor.process(request.input);

    // 4. Call provider
    const raw = await provider.generate({
      ...request,
      input: processedInput,
      model: modelConfig.model,
    });

    // 5. Process output
    const outputProcessor = OutputRegistry[request.outputType];
    const parsed = outputProcessor.process(raw, request.schema);

    return {
      raw,
      parsed,
      metadata: {
        model: modelConfig.model,
      },
    };
  }
}
