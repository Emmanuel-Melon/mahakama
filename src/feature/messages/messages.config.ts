import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { ChatMessage } from "./messages.types";

export const MessageSerializer: JsonApiResourceConfig<ChatMessage> = {
  type: "message",
  attributes: (message: ChatMessage) => message,
};

export const MessageJobs = {
  MessageSent: "message-sent",
  MessageReceived: "message-received",
  MessageFailed: "message-failed",
} as const;

export type MessagesJobType = (typeof MessageJobs)[keyof typeof MessageJobs];
