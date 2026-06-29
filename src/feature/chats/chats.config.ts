import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { ChatSession } from "./chats.types";

export const ChatSerializer: JsonApiResourceConfig<ChatSession> = {
  type: "chat",
  attributes: (chat: ChatSession) => chat,
};

export const ChatsJobs = {
  ChatCreated: "chat-created",
  MessageSent: "message-sent",
} as const;

export type ChatsJobType = (typeof ChatsJobs)[keyof typeof ChatsJobs];
