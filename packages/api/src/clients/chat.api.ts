import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import {
  getClientToken,
  consumeSSEStream,
  handleSSEFetchError,
} from "../api/api.sse";
import type { components } from "../generated/api.types";

export type Chat = components["schemas"]["Chat"];
export type NewChat = components["schemas"]["NewChat"];
export type UpdateChat = components["schemas"]["UpdateChat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse =
  components["schemas"]["ChatCollectionResponse"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];
export type SendMessageRequest = components["schemas"]["SendMessageRequest"];

export type ChatMetadata = ChatSingleResponse["metadata"];
export type ChatResult = ApiResource<Chat, ChatMetadata>;

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

export type ChatStreamEvent =
  | { type: "chat_created"; data: { chat: Chat; userMessage: ChatMessage } }
  | { type: "user_message"; data: ChatMessage }
  | {
      type: "started";
      data: { chatId: string; messageId: string; timestamp: string };
    }
  | { type: "rag_context"; data: { sourcesCount: number; chunksCount: number } }
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

export class ChatApiClient extends BaseApiClient {
  protected readonly path = "/v1/chats";

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async createChat(
    payload: CreateChatRequest,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ChatResult> {
    const response = await this.api.request<ChatSingleResponse>(this.path, {
      method: "POST",
      headers: { ...this.defaultHeaders, ...options.headers },
      data: payload,
    });

    return this.unpackSingle(response, {
      errMsg: "Invalid chat data received from the server",
    });
  }

  public async getChats(
    options: { headers?: Record<string, string> } = {},
  ): Promise<Chat[]> {
    const response = await this.api.request<ChatsCollectionResponse>(
      `${this.path}/`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackCollection(response, {
      errMsg: "Invalid chats data received from the server",
    });
  }

  public async getChatById(
    chatId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ChatResult> {
    const response = await this.api.request<ChatSingleResponse>(
      `${this.path}/${chatId}`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Invalid chat data received from the server",
    });
  }

  public async getChatMessages(
    chatId: string,
    options: {
      headers?: Record<string, string>;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<ChatMessage[]> {
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.append("limit", options.limit.toString());
    if (options.offset) queryParams.append("offset", options.offset.toString());

    const url = `/v1/messages/${chatId}/all${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await this.api.request<
      components["schemas"]["MessageCollectionResponse"]
    >(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
    });

    return this.unpackCollection(response, {
      errMsg: "Invalid messages data received from the server",
    });
  }

  public async sendMessage(
    payload: SendMessageRequest,
    options: { headers?: Record<string, string> } = {},
  ): Promise<void> {
    await this.api.request<void>("/v1/messages", {
      method: "POST",
      headers: { ...this.defaultHeaders, ...options.headers },
      data: payload,
    });
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
      return handleSSEFetchError(
        response,
        `Send failed with status ${response.status}`,
      );
    }

    await consumeSSEStream<ChatStreamEvent>(response, onEvent, signal);
  }

  public async createChatStream(
    payload: CreateChatRequest,
    onEvent: (event: ChatStreamEvent) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
    const token = getClientToken();

    const response = await fetch(`${baseURL}${this.path}`, {
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
      return handleSSEFetchError(
        response,
        `Create chat failed with status ${response.status}`,
      );
    }

    await consumeSSEStream<ChatStreamEvent>(response, onEvent, signal);
  }

  public async retryMessage(
    messageId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ChatMessage> {
    const response = await this.api.request<
      components["schemas"]["MessageSingleResponse"]
    >(`/v1/messages/${messageId}/retry`, {
      method: "POST",
      headers: { ...this.defaultHeaders, ...options.headers },
    });

    const unpacked = this.unpackSingle(response, {
      errMsg: "Invalid message data received from the server",
    });

    return unpacked.data;
  }

  public async updateChat(
    { id, title }: UpdateChat,
    options: { headers?: Record<string, string> } = {},
  ): Promise<ChatResult> {
    const response = await this.api.request<ChatSingleResponse>(
      `${this.path}/${id}`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data: { title: title },
      },
    );

    return this.unpackSingle(response, {
      errMsg: "Invalid chat data received from the server",
    });
  }

  public async deleteChat(
    chatId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<void> {
    await this.api.request<void>(`${this.path}/${chatId}`, {
      method: "DELETE",
      headers: { ...this.defaultHeaders, ...options.headers },
    });
  }
}

let _chatApi: ChatApiClient | null = null;
export const chatApi = new Proxy({} as ChatApiClient, {
  get(_, prop) {
    if (!_chatApi) _chatApi = new ChatApiClient();
    return _chatApi[prop as keyof ChatApiClient];
  },
});
