export const SenderType = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

export type SenderType = (typeof SenderType)[keyof typeof SenderType];
