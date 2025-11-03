import { FetchApiClient, type ApiResponse } from "./fetch";
import type { components } from "./types/api";

export interface MessageSender {
  id: string;
  type: string;
  displayName?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: MessageSender;
  metadata?: Record<string, unknown>;
}

export interface ChatMetadata {
  questionId?: number;
  isQuestionChat?: boolean;
  [key: string]: unknown;
}

export interface ChatType {
  id: string;
  user: {
    id: string;
    type: string;
  };
  title?: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  metadata?: ChatMetadata;
}

interface ChatListResponse {
  success: boolean;
  data: ChatType[];
  message?: string;
}

export class ChatApiClient {
  private api: FetchApiClient;

  constructor(apiKey?: string) {
    this.api = new FetchApiClient({ apiKey });
  }

  public async createChat(
    initialMessage: string,
    options: any = {},
  ): Promise<{ success: boolean; chat: ChatType }> {
    try {
      const payload = {
        title:
          initialMessage.length > 50
            ? `${initialMessage.substring(0, 47)}...`
            : initialMessage,
        initialMessage,
        metadata: {
          ...options.metadata,
        },
      };

      console.log("I got payload", payload);

      const result = await this.api.request<{
        success: boolean;
        data: ChatType;
      }>("/v1/chats", {
        method: "POST",
        body: JSON.stringify(payload),
        ...options,
      });

      if (!result.success || !result.data) {
        console.error("Failed to create chat. Response:", result);
        throw new Error("Failed to create chat");
      }

      return { success: true, chat: result.data };
    } catch (error) {
      console.error("Failed to create chat:", error);
      throw error;
    }
  }

  public async getChats(
    params: {} = {},
    options: any = {},
  ): Promise<ChatType[]> {
    try {
      console.log("options", options);
      const result = await this.api.request<ChatListResponse>(
        "/v1/chats/",
        options,
      );

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Invalid data received from the server");
      }

      return result.data;
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      throw error;
    }
  }

  public async getChatById(
    chatId: string,
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<{ success: boolean; chat: ChatType }> {
    try {
      const response = await this.api.request<{
        success: boolean;
        data: ChatType;
      }>(`/v1/chats/${chatId}`, {
        headers: options.headers,
      });

      console.log("chat by id", response);

      if (!response.success || !response.data) {
        console.error("Invalid chat data:", response);
        throw new Error("Invalid chat data received from the server");
      }

      return { success: true, chat: response.data };
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      throw error;
    }
  }

  public async sendMessage(
    chatId: string,
    message: string,
    options: { headers: HeadersInit; metadata?: Record<string, unknown> } = {
      headers: {},
    },
  ): Promise<{ success: boolean; chat: ChatType }> {
    try {
      const result = await this.api.request<ChatListResponse>(
        `/v1/chats/${chatId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content: message,
            metadata: options.metadata,
          }),
          headers: options.headers,
        },
      );

      if (!result.success || !result.data) {
        console.error("Failed to send message. Response:", result);
        throw new Error("Failed to send message");
      }

      return { success: true, chat: result.data };
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  public async updateChatTitle(
    {
      chatId,
      newTitle,
    }: {
      chatId: string;
      newTitle: string;
    },
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<void> {
    try {
      await this.api.request<{ success: boolean }>(`/v1/chats/${chatId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: newTitle }),
        headers: options.headers,
      });
    } catch (error) {
      console.error("Failed to update chat title:", error);
      throw error;
    }
  }

  public async deleteChat(
    chatId: string,
    options: { headers?: HeadersInit } = {},
  ): Promise<void> {
    try {
      await this.api.request<{ success: boolean }>(`/v1/chats/${chatId}`, {
        method: "DELETE",
        headers: options.headers,
      });
    } catch (error) {
      console.error("Failed to delete chat:", error);
      throw error;
    }
  }
}

export const chatApi = new ChatApiClient();
