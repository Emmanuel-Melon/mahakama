import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { chatApi } from "~/lib/api/chat.api";
import type { components } from "~/lib/api/generated/api.types";

export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse =
  components["schemas"]["ChatsCollectionResponse"];
export type ChatMessage = components["schemas"]["Message"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];
export type SendMessageRequest = components["schemas"]["SendMessageRequest"];
export type JsonApiErrorResponse =
  components["schemas"]["JsonApiErrorResponse"];

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
