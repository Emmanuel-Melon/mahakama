import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  chatApi,
  type ChatMessage,
  type ReplyStatus,
} from "~/lib/api/chat.api";
import type { components } from "~/lib/api/generated/api.types";

export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse =
  components["schemas"]["ChatsCollectionResponse"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];
export type SendMessageRequest = components["schemas"]["SendMessageRequest"];
export type JsonApiErrorResponse =
  components["schemas"]["JsonApiErrorResponse"];

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

export function useChats() {
  return useQuery<Chat[], JsonApiErrorResponse>({
    queryKey: chatsKeys.chats(),
    queryFn: async () => {
      return await chatApi.getChats();
    },
    meta: {
      errorToast: true,
      errorMessage: "Failed to load chats",
    },
  });
}

export function useChat(id: string) {
  return useQuery<Chat, JsonApiErrorResponse>({
    queryKey: chatsKeys.chat(id),
    queryFn: async () => {
      return await chatApi.getChatById(id);
    },
    enabled: !!id,
    meta: {
      errorToast: true,
      errorMessage: "Failed to load chat",
    },
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation<Chat, JsonApiErrorResponse, CreateChatRequest>({
    mutationFn: async (payload: CreateChatRequest) => {
      return await chatApi.createChat(payload);
    },
    onSuccess: (data) => {
      toast.success("Chat created successfully!");
      queryClient.invalidateQueries({ queryKey: chatsKeys.chats() });
    },
    onError: (error) => {
      toast.error("Failed to create chat. Please try again.");
      console.error("Create chat error:", error);
    },
  });
}

export function useUpdateChatTitle() {
  const queryClient = useQueryClient();

  return useMutation<
    Chat,
    JsonApiErrorResponse,
    { chatId: string; newTitle: string }
  >({
    mutationFn: async ({ chatId, newTitle }) => {
      return await chatApi.updateChatTitle({ chatId, newTitle });
    },
    onSuccess: (data, variables) => {
      toast.success("Chat title updated successfully!");
      queryClient.invalidateQueries({ queryKey: chatsKeys.chats() });
      queryClient.invalidateQueries({
        queryKey: chatsKeys.chat(variables.chatId),
      });
    },
    onError: (error) => {
      toast.error("Failed to update chat title. Please try again.");
      console.error("Update chat title error:", error);
    },
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation<void, JsonApiErrorResponse, string>({
    mutationFn: async (chatId: string) => {
      return await chatApi.deleteChat(chatId);
    },
    onSuccess: () => {
      toast.success("Chat deleted successfully!");
      queryClient.invalidateQueries({ queryKey: chatsKeys.chats() });
    },
    onError: (error) => {
      toast.error("Failed to delete chat. Please try again.");
      console.error("Delete chat error:", error);
    },
  });
}

export function useMessages(chatId: string) {
  return useQuery<ChatMessage[], JsonApiErrorResponse>({
    queryKey: chatsKeys.messages(chatId),
    queryFn: async () => {
      return await chatApi.getChatMessages(chatId);
    },
    enabled: !!chatId,
    refetchInterval: (query) => {
      const messages = query.state.data;
      const lastMessage = messages?.[messages.length - 1];
      return lastMessage && isReplyAwaiting(lastMessage)
        ? REPLY_POLL_INTERVAL_MS
        : false;
    },
    meta: {
      errorToast: true,
      errorMessage: "Failed to load messages",
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<void, JsonApiErrorResponse, SendMessageRequest>({
    mutationFn: async (payload: SendMessageRequest) => {
      return await chatApi.sendMessage(payload);
    },
    onSuccess: (data, variables) => {
      // Invalidate the specific chat to refresh messages
      queryClient.invalidateQueries({
        queryKey: chatsKeys.chat(variables.chatId),
      });
      // Invalidate messages cache to refresh the message list
      queryClient.invalidateQueries({
        queryKey: chatsKeys.messages(variables.chatId),
      });
    },
    onError: (error) => {
      toast.error("Failed to send message. Please try again.");
      console.error("Send message error:", error);
    },
  });
}

export function useRetryMessage(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, JsonApiErrorResponse, string>({
    mutationFn: async (messageId: string) => {
      return await chatApi.retryMessage(messageId);
    },
    onSuccess: () => {
      toast.success("Reply generation restarted.");
      queryClient.invalidateQueries({
        queryKey: chatsKeys.messages(chatId),
      });
    },
    onError: (error) => {
      toast.error("Failed to retry reply. Please try again.");
      console.error("Retry message error:", error);
    },
  });
}
