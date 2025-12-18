import type { Route } from "./+types/$chatId";
import { ChatScreen } from "~/feature/chats/screens/ChatScreen";
import { useChat } from "~/feature/chats/hooks/use-chats";
import { LoadingState } from "~/components/async-state/loading";
import { ErrorState } from "~/components/async-state/error";
import { authContext } from "~/middleware/context";
import { useUser } from "~/context/user-provider";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Chat - Mahakama" },
    { name: "description", content: "View your legal answer" },
  ];
}

export default function ChatDetailsPage({ params }: Route.ComponentProps) {
  const { chatId } = params;
  const { user } = useUser();
  const { data: chat, isLoading, error } = useChat(chatId);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!chat) return <ErrorState error={new Error("Chat not found")} />;

  return <ChatScreen chat={chat} />;
}
