const API_V1 = "/api/v1";

export const CHATS_ROUTES = {
  NEW: {
    URL_SEGMENT: "new",
    PATH: "routes/chats/chats.new.tsx",
    NAME: "chatNew",
    LABEL: "New Chat",
  },
  RECENTS: {
    URL_SEGMENT: "recents",
    PATH: "routes/chats/chats.recents.tsx",
    NAME: "chatRecents",
    LABEL: "Recent Chats",
  },
  CHAT_DETAIL: {
    URL_SEGMENT: ":chatId",
    PATH: "routes/chats/$chatId.tsx",
    NAME: "chatDetail",
    LABEL: "Chat Details",
  },
} as const;

export const CHATS_API_ROUTES = {
  ROOT: `${API_V1}/chats`,
  CHAT: `${API_V1}/chats/:chatId`,
  MESSAGES: `${API_V1}/chats/:chatId/messages`,
} as const;

export const MESSAGES_ROUTES = {
  INDEX: {
    URL_SEGMENT: "messages",
    PATH: "routes/messages/index.tsx",
    NAME: "messagesIndex",
    LABEL: "Messages",
  },
  DETAIL: {
    URL_SEGMENT: ":conversationId",
    PATH: "routes/messages/conversationId.tsx",
    NAME: "messageDetail",
    LABEL: "Message Details",
  },
} as const;

export const MESSAGES_API_ROUTES = {
  ROOT: `${API_V1}/messages`,
  MESSAGE: `${API_V1}/messages/:conversationId`,
} as const;
