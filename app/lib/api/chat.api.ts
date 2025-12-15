import { FetchApiClient } from "./fetch";
import type { components } from "./generated/api.types";
export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse = components["schemas"]["ChatsCollectionResponse"];
export type ChatMessage = components["schemas"]["Message"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];

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
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<Chat> {
    try {
      const payload = {
        title: initialMessage,
      };

      const response = await this.api.request<ChatSingleResponse>("/v1/chats", {
        method: "POST",
        headers: options.headers,
        body: JSON.stringify(payload),
      });

      if (!response.data.attributes) {
        console.error("Invalid chat data:", response);
        throw new Error("Invalid chat data received from the server");
      }

      return response.data.attributes;
    } catch (error) {
      console.error("Failed to create chat:", error);
      throw error;
    }
  }

  public async getChats(
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<Chat[]> {
    try {
      const response = await this.api.request<ChatsCollectionResponse>(
        "/v1/chats/",
        {
          headers: options.headers,
        },
      );
      
      if (!response.data) {
        console.error("Invalid chats data:", response);
        throw new Error("Invalid chats data received from the server");
      }
      
      const chats = response.data.map((resource) => resource.attributes);
      return chats;
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      throw error;
    }
  }

  public async getChatById(
    chatId: string,
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<Chat> {
    try {
      const response = await this.api.request<ChatSingleResponse>(`/v1/chats/${chatId}`, {
        headers: options.headers,
      });
      
      if (!response.data.attributes) {
        console.error("Invalid chat data:", response);
        throw new Error("Invalid chat data received from the server");
      }

      return response.data.attributes;
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
  ): Promise<void> {
    try {
      await this.api.request<ChatSingleResponse>(
        `/v1/chats/${chatId}/messages`,
        {
          method: "POST",
          headers: options.headers,
          body: JSON.stringify({
            content: message,
            metadata: options.metadata,
          }),
        },
      );
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
  ): Promise<Chat> {
    try {
      const response = await this.api.request<ChatSingleResponse>(`/v1/chats/${chatId}`, {
        method: "PATCH",
        headers: options.headers,
        body: JSON.stringify({ title: newTitle }),
      });
      
      if (!response.data.attributes) {
        console.error("Invalid chat data:", response);
        throw new Error("Invalid chat data received from the server");
      }

      return response.data.attributes;
    } catch (error) {
      console.error("Failed to update chat title:", error);
      throw error;
    }
  }

  public async deleteChat(
    chatId: string,
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<void> {
    try {
      await this.api.request<void>(`/v1/chats/${chatId}`, {
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
