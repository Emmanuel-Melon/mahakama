import { encodingForModel } from "js-tiktoken";

// Cache the encoder instance to avoid reloading vocabulary maps on every call
const encoder = encodingForModel("gpt-4o");

/**
 * Calculates the exact token count using OpenAI's tiktoken BPE tokenizer.
 */
export function calculateTokenCount(content: string): number {
  if (!content) return 0;
  return encoder.encode(content).length;
}
