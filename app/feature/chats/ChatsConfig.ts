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

const API_V1 = "/api/v1";

export const CHATS_API_ROUTES = {
  ROOT: `${API_V1}/chats`,
  CHAT: `${API_V1}/chats/:chatId`,
  MESSAGES: `${API_V1}/chats/:chatId/messages`,
} as const;