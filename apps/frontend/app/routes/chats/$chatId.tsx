import type { Route } from "./+types/$chatId";
import { ChatScreen } from "~/feature/chats/screens/ChatScreen";
import { useChat, useMessages } from "@mah/api/hooks/use-chats";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat - Mahakama" },
    { name: "description", content: "View your legal answer" },
  ];
}

export default function ChatDetailsPage({ params }: Route.ComponentProps) {
  const { chatId } = params;
  const { data: chat, isLoading, error } = useChat(chatId);
  const { data: messages, isLoading: messagesLoading } = useMessages(
    chat?.id || "",
  );
  return (
    <ChatScreen
      chat={chat || null}
      isLoading={isLoading}
      error={error}
      messages={messages || []}
      messagesLoading={messagesLoading}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
