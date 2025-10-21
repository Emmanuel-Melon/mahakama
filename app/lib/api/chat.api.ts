import { FetchApiClient, type ApiResponse } from './fetch';
import type { Chat } from '~/chat/types.chat';


interface ChatListResponse {
  chats: Chat[];
}

export class ChatApiClient {
  private api: FetchApiClient;

  constructor(apiKey?: string) {
    this.api = new FetchApiClient({ apiKey });
  }

  public async getChats(): Promise<Chat[]> {
    try {
      const result = await this.api.request<ApiResponse<ChatListResponse>>('/chats/');
      
      if (!result.success || !result.data?.chats) {
        throw new Error('Invalid data received from the server');
      }

      return [...result.data.chats].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      throw error;
    }
  }

  public async updateChatTitle(chatId: string, newTitle: string): Promise<void> {
    try {
      await this.api.request<ApiResponse<{ chat: Chat }>>(
        `/chats/${chatId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ title: newTitle }),
        }
      );
    } catch (error) {
      console.error('Failed to update chat title:', error);
      throw error;
    }
  }

  public async deleteChat(chatId: string): Promise<void> {
    try {
      await this.api.request<ApiResponse<void>>(
        `/chats/${chatId}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      console.error('Failed to delete chat:', error);
      throw error;
    }
  }
}


export const chatApi = new ChatApiClient();
