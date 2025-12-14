import { FetchApiClient, type ApiResponse } from "./fetch";
import type { components } from "./generated/api.types";

export type ChatType = components["schemas"]["Chat"];
export type ChatMessage = components["schemas"]["Message"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];

interface ChatListResponse {
  success: boolean;
  data: {
    chats: ChatType[];
  };
  message?: string;
}

export interface MessageSender {
  id: string;
  type: string;
  displayName?: string;
}


export interface ChatMetadata {
  questionId?: number;
  isQuestionChat?: boolean;
  [key: string]: unknown;
}
export class ChatApiClient {
  private api: FetchApiClient;

  constructor() {
    this.api = new FetchApiClient();
  }

  public async createChat(
    initialMessage: string,
    options: any = {},
  ): Promise<{ success: boolean; chat: ChatType }> {
    try {
      const payload = {
        title: initialMessage,
      };

      const response = await this.api.request<{
        success: boolean;
        data: { chat: ChatType };
      }>("/v1/chats", {
        method: "POST",
        body: JSON.stringify(payload),
        ...options,
      });

      if (!response.success || !response.data) {
        console.error("Failed to create chat. Response:", response);
        throw new Error("Failed to create chat");
      }

      return { success: true, chat: response.data.chat };
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

      const response = await this.api.request<ChatListResponse>(
        "/v1/chats/",
        options,
      );
      return response.data.chats;
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
        data: { chat: ChatType };
      }>(`/v1/chats/${chatId}`, {
        headers: options.headers,
      });
      if (!response.success || !response.data) {
        console.error("Invalid chat data:", response);
        throw new Error("Invalid chat data received from the server");
      }

      return { success: true, chat: response.data.chat };
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
  ): Promise<{ success: boolean; message: ChatType | null }> {
    try {
      const response = await this.api.request<ChatListResponse>(
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

      if (!response.success || !response.data) {
        console.error("Failed to send message. Response:", response);
        throw new Error("Failed to send message");
      }

      return { success: true, message: null };
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
