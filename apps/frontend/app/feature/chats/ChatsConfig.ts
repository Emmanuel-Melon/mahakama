import { defineRoutes } from "@mah/client/nav";
import en from "../../locales/en/chats.json";
import ar from "../../locales/ar/chats.json";
import type { I18nConfig } from "@mah/client/i18n";

const API_V1 = "/api/v1";

export const chatsRoutes = defineRoutes({
  new: { path: "chats/new", file: "routes/chats/chats.new.tsx" },
  recents: { path: "chats/recents", file: "routes/chats/chats.recents.tsx" },
  chatDetail: { path: "chats/:chatId", file: "routes/chats/$chatId.tsx" },
});

export const ChatsPaths = chatsRoutes.to;

export const messagesRoutes = defineRoutes({
  index: { path: "messages", file: "routes/messages/index.tsx" },
  detail: {
    path: "messages/:conversationId",
    file: "routes/messages/conversationId.tsx",
  },
});

export const MessagesPaths = messagesRoutes.to;

export const MESSAGES_API_ROUTES = {
  ROOT: `${API_V1}/messages`,
  MESSAGE: `${API_V1}/messages/:conversationId`,
} as const;

export const CHATS_API_ROUTES = {
  ROOT: `${API_V1}/chats`,
  CHAT: `${API_V1}/chats/:chatId`,
  MESSAGES: `${API_V1}/chats/:chatId/messages`,
} as const;

export const chatsI18n: I18nConfig<"chats", typeof en> = {
  namespace: "chats",
  resources: {
    en,
    ar,
  },
};
