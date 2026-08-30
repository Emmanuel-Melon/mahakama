import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  Maximize2,
  MessageSquareText,
  Sparkles,
  X,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@mah/ui/components/drawer";
import { useChat, useMessages } from "@mah/api/src/hooks/chats/use-chats";
import type { ChatMessage } from "@mah/api/src/clients/chat.api";
import { MessageBubble } from "~/feature/chats/components/MessageBubble";
import { ChatsPaths } from "~/feature/chats/ChatsConfig";

const SUBSTANTIVE_MIN_LENGTH = 300;

const isSubstantiveAssistantMessage = (message: ChatMessage) => {
  if (message.senderType !== "assistant") return false;
  const sources = message.metadata?.sources;
  return (
    (Array.isArray(sources) && sources.length > 0) ||
    message.content.length >= SUBSTANTIVE_MIN_LENGTH
  );
};

function EraDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
        {date}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function MatterChatConversation({ chatId }: { chatId: string }) {
  const { t } = useTranslation("matters");
  const { data: messagesData, isLoading } = useMessages(chatId);
  const messages = messagesData?.data ?? [];

  const usedInSummaryIds = useMemo(
    () =>
      new Set(messages.filter(isSubstantiveAssistantMessage).map((m) => m.id)),
    [messages],
  );

  if (isLoading) {
    return (
      <p className="px-4 py-6 text-sm text-gray-500">{t("chat.loading")}</p>
    );
  }

  if (messages.length === 0) {
    return <p className="px-4 py-6 text-sm text-gray-500">{t("chat.empty")}</p>;
  }

  let lastDate = "";

  return (
    <>
      <div className="px-4 py-4 space-y-3 overflow-y-auto">
        {messages.map((message) => {
          const dateKey = new Date(message.timestamp).toDateString();
          const showEra = dateKey !== lastDate;
          lastDate = dateKey;
          const chipVisible =
            message.senderType === "assistant" &&
            usedInSummaryIds.has(message.id);

          return (
            <div key={message.id}>
              {showEra && (
                <EraDivider
                  date={new Date(message.timestamp).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                />
              )}
              <div className={chipVisible ? "relative mb-2" : "relative"}>
                <MessageBubble message={message} />
                {chipVisible && (
                  <span className="absolute -bottom-2 left-8 z-10 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    <Sparkles className="h-3 w-3" />
                    {t("chat.usedInSummary")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 px-4 py-3">
        <a
          href={ChatsPaths.chatDetail({ chatId })}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          {t("chat.openFull")}
        </a>
      </div>
    </>
  );
}

function MatterChatDesktop({
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

function MatterChatMobile({ chatId }: { chatId: string }) {
  const { t } = useTranslation("matters");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-lg border-2 border-black bg-yellow-300 px-3 py-2 text-xs font-bold text-gray-900 shadow-[3px_3px_0_0_#000] hover:bg-yellow-400 lg:hidden"
      >
        <MessageSquareText className="h-4 w-4" />
        {t("chat.title")}
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DrawerTitle>{t("chat.title")}</DrawerTitle>
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label={t("chat.close")}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="overflow-y-auto pb-8">
            <MatterChatConversation chatId={chatId} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function MatterChatPanel({ chatId }: { chatId: string | null }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!chatId) return null;

  return (
    <>
      <MatterChatDesktop
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        chatId={chatId}
      />
      <MatterChatMobile chatId={chatId} />
    </>
  );
}
