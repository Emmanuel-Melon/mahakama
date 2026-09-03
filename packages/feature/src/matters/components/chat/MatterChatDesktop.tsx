import { useTranslation } from "react-i18next";
import { Maximize2, MessageSquareText, X } from "lucide-react";
import { useChat } from "@mah/api/src/hooks/chats/use-chats";
import { MatterChatConversation } from "./MatterChatConversation";

export function MatterChatDesktop({
  collapsed,
  onToggleCollapsed,
  chatId,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  chatId: string;
}) {
  const { t } = useTranslation("matters");
  const { data: chat } = useChat(chatId);

  if (collapsed) {
    return (
      <div className="hidden lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)] flex-col border-l-2 border-gray-900 bg-white">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={t("chat.title")}
          className="flex flex-col items-center gap-3 py-5 px-3 hover:bg-gray-50"
        >
          <Maximize2 className="h-4 w-4 text-gray-600" />
          <span className="text-xs font-bold text-gray-700 [writing-mode:vertical-rl] rotate-180">
            {t("chat.title")}
          </span>
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)] flex-col border-l-2 border-gray-900 bg-white">
      <header className="flex items-center justify-between gap-2 border-b-2 border-gray-900 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquareText className="h-4 w-4 shrink-0 text-gray-500" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {t("chat.title")}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {chat?.title || "—"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={t("chat.close")}
          className="shrink-0 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto">
        <MatterChatConversation chatId={chatId} />
      </div>
    </aside>
  );
}
