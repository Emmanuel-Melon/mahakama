// chat.progress.ts
import { EventEmitter } from "events";
import type { ChatStreamEvent } from "./chat.events";

const chatEmitter = new EventEmitter();
chatEmitter.setMaxListeners(0);

export const publishChatEvent = (chatId: string, event: ChatStreamEvent) => {
  chatEmitter.emit(chatId, event);
};

export const subscribeChat = (
  chatId: string,
  listener: (event: ChatStreamEvent) => void,
): (() => void) => {
  chatEmitter.on(chatId, listener as (...args: unknown[]) => void);
  return () => {
    chatEmitter.off(chatId, listener as (...args: unknown[]) => void);
  };
};
