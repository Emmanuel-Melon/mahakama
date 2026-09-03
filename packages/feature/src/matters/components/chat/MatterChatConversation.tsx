import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useMessages } from "@mah/api/src/hooks/chats/use-chats";
import { useMatterFeature } from "../../MatterFeatureContext";
import { EraDivider } from "./EraDivider";
import { isSubstantiveAssistantMessage } from "./chat.utils";

export function MatterChatConversation({ chatId }: { chatId: string }) {
  const { t } = useTranslation("matters");
  const { data: messagesData, isLoading } = useMessages(chatId);
  const { chatPathResolver, MessageComponent } = useMatterFeature();
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
                {MessageComponent ? (
                  <MessageComponent message={message} />
                ) : (
                  <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}
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
        {chatPathResolver && (
          <a
            href={chatPathResolver(chatId)}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            {t("chat.openFull")}
          </a>
        )}
      </div>
    </>
  );
}
