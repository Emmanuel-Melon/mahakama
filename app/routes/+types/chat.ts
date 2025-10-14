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
  question: any;
  answer: string;
  relevantLaws: never[];
  relatedDocuments: never[];
  id: string;
  title: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isGroup: boolean;
  unreadCount: number;
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
