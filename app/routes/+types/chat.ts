import type { components } from "../../lib/api/types/api";
import type {
  ChatType as APIChatType,
  ChatMessage as APIChatMessage,
} from "../../lib/api/chat.api";

type APIChat = components["schemas"]["Chat"];
type APIMessage = components["schemas"]["Message"];
type APIUser = components["schemas"]["User"];

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  lastSeen?: string;
  isOnline: boolean;
}

export interface ChatDetails {
  id: string;
  title: string;
  question: string;
  answer: string | APIChatMessage[];
  relevantLaws: any[];
  relatedDocuments: any[];
  participants: ChatParticipant[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isGroup: boolean;
  unreadCount: number;
  metadata?: {
    questionId?: number;
    isQuestionChat?: boolean;
    [key: string]: unknown;
  };
  user?: APIUser;
}

export interface LoaderData {
  chat: ChatDetails | null;
  error?: string;
}

export interface MetaArgs {
  loaderData: LoaderData;
}

export interface LoaderArgs {
  params: {
    chatId: string;
  };
}

export interface ComponentProps {
  loaderData: LoaderData;
}
