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

  public async getChats(): Promise<ChatType[]> {
    try {
      const result = await this.api.request<ChatListResponse>("/v1/chats/");

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
  ): Promise<{ success: boolean; chat: ChatType }> {
    try {
      const response = await this.api.request<{
        success: boolean;
        data: ChatType;
      }>(`/v1/chats/${chatId}`);

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
  ): Promise<{ success: boolean; chat: ChatType }> {
    try {
      const result = await this.api.request<ChatListResponse>(
        `/v1/chats/${chatId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content: message }),
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
    chatId: string,
    newTitle: string,
  ): Promise<void> {
    try {
      await this.api.request<{ success: boolean }>(`/v1/chats/${chatId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (error) {
      console.error("Failed to update chat title:", error);
      throw error;
    }
  }

  public async deleteChat(chatId: string): Promise<void> {
    try {
      await this.api.request<{ success: boolean }>(`/v1/chats/${chatId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete chat:", error);
      throw error;
    }
  }
}

export const chatApi = new ChatApiClient();
