import { chatSystemPrompt } from "../inference.prompts";
import { InferenceStrategyRegistry } from "../inference.registry";
import type { ChatInput, IInferenceStrategy } from "../inference.types";

const chatStrategy: IInferenceStrategy<ChatInput, string> = {
  key: "chat",
  preferredProvider: "ollama",
  fallbackProvider: "gemini",
  defaultModel: "gemma:b3",
  systemPrompt: chatSystemPrompt,

  buildPrompt(input: ChatInput): string {
    if (!input.history?.length) {
      return input.message;
    }
    const history = input.history
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    return `${history}\nUser: ${input.message}`;
  },
};

InferenceStrategyRegistry.register(chatStrategy);

export { chatStrategy };
