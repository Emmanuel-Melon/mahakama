import { useQuery } from "@tanstack/react-query";
import {
  chatApi,
  type Chat,
  type ChatMessage,
  type CreateChatRequest,
  type SendMessageRequest,
  type ReplyStatus,
  type UpdateChat,
} from "../../clients/chat.api";
import type { ApiClientError } from "../../api/api.errors";
import { useAppMutation } from "../../react-query/react-query.utils";

const REPLY_POLL_INTERVAL_MS = 2000;
const REPLY_TIMEOUT_MS = 60_000;

export function getMessageReplyStatus(
  message: ChatMessage,
): ReplyStatus | undefined {
  return message.metadata?.replyStatus;
}

export function isUserMessage(message: ChatMessage): boolean {
  return message.senderType === "user";
}

export function isReplyAwaiting(
  message: ChatMessage,
  now: number = Date.now(),
): boolean {
  return (
    isUserMessage(message) &&
    getMessageReplyStatus(message) === "pending" &&
    now - new Date(message.timestamp).getTime() < REPLY_TIMEOUT_MS
  );
}

export function hasFailedReply(message: ChatMessage): boolean {
  return isUserMessage(message) && getMessageReplyStatus(message) === "failed";
}

export function isStalePendingReply(
  message: ChatMessage,
  now: number = Date.now(),
): boolean {
  return (
    isUserMessage(message) &&
    getMessageReplyStatus(message) === "pending" &&
    !isReplyAwaiting(message, now)
  );
}

export const chatsKeys = {
  all: ["chats"] as const,
  chats: () => [...chatsKeys.all, "chats"] as const,
  chat: (id: string) => [...chatsKeys.all, "chat", id] as const,
  messages: (chatId: string) => [...chatsKeys.all, "messages", chatId] as const,
};

export const chatsQueries = {
  chats: () => ({
    queryKey: chatsKeys.chats(),
    queryFn: () => chatApi.getChats(),
  }),
  chat: (id: string) => ({
    queryKey: chatsKeys.chat(id),
    queryFn: () => chatApi.getChatById(id),
    enabled: !!id,
  }),
  messages: (chatId: string) => ({
    queryKey: chatsKeys.messages(chatId),
    queryFn: () => chatApi.getChatMessages(chatId),
    enabled: !!chatId,
    refetchInterval: (query: { state: { data?: ChatMessage[] } }) => {
      const messages = query.state.data;
      const lastMessage = messages?.[messages.length - 1];
      return lastMessage && isReplyAwaiting(lastMessage)
        ? REPLY_POLL_INTERVAL_MS
        : false;
    },
  }),
};

export const useChats = () =>
  useQuery<Chat[], ApiClientError>(chatsQueries.chats());

export const useChat = (id: string) =>
  useQuery<Chat, ApiClientError>(chatsQueries.chat(id));

export const useMessages = (chatId: string) =>
  useQuery<ChatMessage[], ApiClientError>(chatsQueries.messages(chatId));

export const useChatMutations = () => {
  const createChat = useAppMutation<Chat, ApiClientError, CreateChatRequest>({
    mutationFn: (payload) => chatApi.createChat(payload),
    messages: {
      success: "Chat created successfully!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to create chat. Please try again.",
    },
    invalidates: [chatsKeys.chats()],
  });

  const updateChatTitle = useAppMutation<Chat, ApiClientError, UpdateChat>({
    mutationFn: ({ id, title }) => chatApi.updateChat({ id, title }),
    messages: {
      success: "Chat title updated successfully!",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to update chat title. Please try again.",
    },
    // useAppMutation's invalidates only takes variables
    invalidates: (variables) => [
      chatsKeys.chats(),
      chatsKeys.chat(variables.chatId),
    ],
  });

  const deleteChat = useAppMutation<void, ApiClientError, string>({
    mutationFn: (chatId) => chatApi.deleteChat(chatId),
    messages: {
      success: "Chat deleted successfully!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to delete chat. Please try again.",
    },
    invalidates: [chatsKeys.chats()],
  });

  const sendMessage = useAppMutation<void, ApiClientError, SendMessageRequest>({
    mutationFn: (payload) => chatApi.sendMessage(payload),
    messages: {
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to send message. Please try again.",
    },
    invalidates: (variables) => [
      chatsKeys.chat(variables.chatId),
      chatsKeys.messages(variables.chatId),
    ],
  });

  const retryMessage = useAppMutation<
    ChatMessage,
    ApiClientError,
    { messageId: string; chatId: string }
  >({
    // Bundled variables together to handle invalidation via chat ID cleanly
    mutationFn: ({ messageId }) => chatApi.retryMessage(messageId),
    messages: {
      success: "Reply generation restarted.",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to retry reply. Please try again.",
    },
    invalidates: (variables) => [chatsKeys.messages(variables.chatId)],
  });

  return {
    createChat,
    updateChatTitle,
    deleteChat,
    sendMessage,
    retryMessage,
  };
};
