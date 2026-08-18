import { FetchApiClient } from "../fetch";
import { parseCookies } from "../api.utils";
import type { components } from "../generated/api.types";

export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse =
  components["schemas"]["ChatCollectionResponse"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];
export type SendMessageRequest = components["schemas"]["SendMessageRequest"];

export type SenderType = "user" | "assistant" | "system";

export type ReplyStatus = "pending" | "completed" | "failed";

export type CitationStatus = "ok" | "missing";

export interface RAGSource {
  id: string;
  title: string;
  category?: string;
  source?: string;
  section?: string | null;
  similarity: number;
  fullCitation?: string;
  url?: string;
  actName?: string;
  jurisdiction?: string;
  lastUpdated?: string;
  content?: string;
  stale?: boolean;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  content: string;
  senderType: SenderType;
  userId: string | null;
  timestamp: string;
  metadata: Record<string, unknown> & {
    replyStatus?: ReplyStatus;
    errorMessage?: string;
    sources?: RAGSource[];
    citationStatus?: CitationStatus;
    citations?: string[];
    hasStaleSources?: boolean;
  };
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

export type ChatStreamEvent =
  | {
      type: "chat_created";
      data: { chat: Chat; userMessage: ChatMessage };
    }
  | {
      type: "user_message";
      data: ChatMessage;
    }
  | {
      type: "started";
      data: { chatId: string; messageId: string; timestamp: string };
    }
  | {
      type: "rag_context";
      data: { sourcesCount: number; chunksCount: number };
    }
  | { type: "token"; data: { content: string } }
  | {
      type: "completed";
      data: {
        messageId: string;
        content: string;
        citations?: string[];
        sources?: unknown[];
        hasStaleSources?: boolean;
        fabricatedCitations?: string[];
      };
    }
  | { type: "error"; data: { message: string; code?: string } };

const getClientToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = parseCookies(document.cookie);
  return cookies.token ?? null;
};

const parseSSEBlock = (
  block: string,
): { type: string; data: unknown } | null => {
  const lines = block.split("\n");
  let type = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.replace(/\r$/, "");
    if (trimmed.startsWith(":")) continue;
    if (trimmed.startsWith("event:")) {
      type = trimmed.slice(6).trim();
    } else if (trimmed.startsWith("data:")) {
      dataLines.push(trimmed.slice(5).trim());
    }
  }

  if (dataLines.length === 0) return null;
  return { type, data: JSON.parse(dataLines.join("\n")) };
};
export class ChatApiClient {
  private api: FetchApiClient;

  constructor() {
    this.api = new FetchApiClient();
  }

  public async createChat(
    payload: CreateChatRequest,
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<Chat> {
    try {
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

      const chats = response.data.map(
        (resource: ChatResource) => resource.attributes,
      );
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
      const response = await this.api.request<ChatSingleResponse>(
        `/v1/chats/${chatId}`,
        {
          headers: options.headers,
        },
      );

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

  public async getChatMessages(
    chatId: string,
    options: { headers: HeadersInit; limit?: number; offset?: number } = {
      headers: {},
    },
  ): Promise<ChatMessage[]> {
    try {
      const queryParams = new URLSearchParams();
      if (options.limit) queryParams.append("limit", options.limit.toString());
      if (options.offset)
        queryParams.append("offset", options.offset.toString());

      const url = `/v1/messages/${chatId}/all${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const response = await this.api.request<{ data: ChatResource[] }>(url, {
        headers: options.headers,
      });

      if (!response.data) {
        console.error("Invalid messages data:", response);
        throw new Error("Invalid messages data received from the server");
      }

      const messages = response.data.map(
        (resource: ChatResource) => resource.attributes,
      );
      return messages;
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
      throw error;
    }
  }

  public async sendMessage(
    payload: SendMessageRequest,
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<void> {
    try {
      await this.api.request<void>("/v1/messages", {
        method: "POST",
        headers: options.headers,
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  public async sendMessageStream(
    payload: SendMessageRequest,
    onEvent: (event: ChatStreamEvent) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
    const token = getClientToken();

    const response = await fetch(`${baseURL}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      credentials: "include",
      signal,
    });

    if (!response.ok) {
      let message = `Send failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        message =
          errorData.errors?.[0]?.detail ||
          errorData.errors?.[0]?.title ||
          message;
      } catch {
        // Non-JSON error body
      }
      throw new Error(message);
    }

    if (!response.body) {
      throw new Error("No response body received from the server");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const parsed = parseSSEBlock(block);
        if (parsed) {
          onEvent(parsed as ChatStreamEvent);
        }
        boundary = buffer.indexOf("\n\n");
      }
    }
  }

  public async createChatStream(
    payload: CreateChatRequest,
    onEvent: (event: ChatStreamEvent) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
    const token = getClientToken();

    const response = await fetch(`${baseURL}/v1/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      credentials: "include",
      signal,
    });

    if (!response.ok) {
      let message = `Create chat failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        message =
          errorData.errors?.[0]?.detail ||
          errorData.errors?.[0]?.title ||
          message;
      } catch {
        // Non-JSON error body
      }
      throw new Error(message);
    }

    if (!response.body) {
      throw new Error("No response body received from the server");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const parsed = parseSSEBlock(block);
        if (parsed) {
          onEvent(parsed as ChatStreamEvent);
        }
        boundary = buffer.indexOf("\n\n");
      }
    }
  }

  public async retryMessage(
    messageId: string,
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<ChatMessage> {
    try {
      const response = await this.api.request<{
        data: { attributes: ChatMessage };
      }>(`/v1/messages/${messageId}/retry`, {
        method: "POST",
        headers: options.headers,
      });

      if (!response.data.attributes) {
        console.error("Invalid message data:", response);
        throw new Error("Invalid message data received from the server");
      }

      return response.data.attributes;
    } catch (error) {
      console.error("Failed to retry message:", error);
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
      const response = await this.api.request<ChatSingleResponse>(
        `/v1/chats/${chatId}`,
        {
          method: "PATCH",
          headers: options.headers,
          body: JSON.stringify({ title: newTitle }),
        },
      );

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
