import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import {
  chatApi,
  type CreateChatRequest,
  type SendMessageRequest,
  type ChatMessage,
} from "../../clients/chat.api";
import { chatsKeys } from "./use-chats";

export interface ChatStreamState {
  status: "idle" | "streaming" | "completed" | "error";
  chatId: string | null;
  userMessage: ChatMessage | null;
  assistantContent: string;
  assistantMessageId: string | null;
  error: string | null;
  ragContext: { sourcesCount: number; chunksCount: number } | null;
}

export function useSendMessageStream() {
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const [streamState, setStreamState] = useState<ChatStreamState>({
    status: "idle",
    chatId: null,
    userMessage: null,
    assistantContent: "",
    assistantMessageId: null,
    error: null,
    ragContext: null,
  });

  const mutate = useCallback(
    (payload: SendMessageRequest) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStreamState({
        status: "streaming",
        chatId: payload.chatId,
        userMessage: null,
        assistantContent: "",
        assistantMessageId: null,
        error: null,
        ragContext: null,
      });

      chatApi
        .sendMessageStream(
          payload,
          (event) => {
            switch (event.type) {
              case "user_message":
                setStreamState((prev) => ({
                  ...prev,
                  userMessage: event.data,
                }));
                break;
              case "rag_context":
                setStreamState((prev) => ({
                  ...prev,
                  ragContext: event.data,
                }));
                break;
              case "token":
                setStreamState((prev) => ({
                  ...prev,
                  assistantContent: prev.assistantContent + event.data.content,
                }));
                break;
              case "completed":
                setStreamState((prev) => ({
                  ...prev,
                  status: "completed",
                  assistantMessageId: event.data.messageId,
                  assistantContent: event.data.content,
                }));
                queryClient.invalidateQueries({
                  queryKey: chatsKeys.messages(payload.chatId),
                });
                queryClient.invalidateQueries({
                  queryKey: chatsKeys.chat(payload.chatId),
                });
                break;
              case "error":
                setStreamState((prev) => ({
                  ...prev,
                  status: "error",
                  error: event.data.message,
                }));
                break;
            }
          },
          controller.signal,
        )
        .catch((error) => {
          if (error.name !== "AbortError") {
            setStreamState((prev) => ({
              ...prev,
              status: "error",
              error: error.message || "Stream failed",
            }));
          }
        });
    },
    [queryClient],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStreamState({
      status: "idle",
      chatId: null,
      userMessage: null,
      assistantContent: "",
      assistantMessageId: null,
      error: null,
      ragContext: null,
    });
  }, []);

  return { mutate, streamState, reset };
}

export function useCreateChatStream() {
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const [streamState, setStreamState] = useState<ChatStreamState>({
    status: "idle",
    chatId: null,
    userMessage: null,
    assistantContent: "",
    assistantMessageId: null,
    error: null,
    ragContext: null,
  });

  const mutate = useCallback(
    (payload: CreateChatRequest) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStreamState({
        status: "streaming",
        chatId: null,
        userMessage: null,
        assistantContent: "",
        assistantMessageId: null,
        error: null,
        ragContext: null,
      });

      chatApi
        .createChatStream(
          payload,
          (event) => {
            switch (event.type) {
              case "chat_created":
                setStreamState((prev) => ({
                  ...prev,
                  chatId: event.data.chat.id,
                  userMessage: event.data.userMessage,
                }));
                break;
              case "rag_context":
                setStreamState((prev) => ({
                  ...prev,
                  ragContext: event.data,
                }));
                break;
              case "token":
                setStreamState((prev) => ({
                  ...prev,
                  assistantContent: prev.assistantContent + event.data.content,
                }));
                break;
              case "completed":
                setStreamState((prev) => ({
                  ...prev,
                  status: "completed",
                  assistantMessageId: event.data.messageId,
                  assistantContent: event.data.content,
                }));
                queryClient.invalidateQueries({
                  queryKey: chatsKeys.chats(),
                });
                break;
              case "error":
                setStreamState((prev) => ({
                  ...prev,
                  status: "error",
                  error: event.data.message,
                }));
                break;
            }
          },
          controller.signal,
        )
        .catch((error) => {
          if (error.name !== "AbortError") {
            setStreamState((prev) => ({
              ...prev,
              status: "error",
              error: error.message || "Stream failed",
            }));
          }
        });
    },
    [queryClient],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStreamState({
      status: "idle",
      chatId: null,
      userMessage: null,
      assistantContent: "",
      assistantMessageId: null,
      error: null,
      ragContext: null,
    });
  }, []);

  return { mutate, streamState, reset };
}
