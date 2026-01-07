import type { Route } from "./+types/$chatId";
import { ChatScreen } from "~/feature/chats/screens/ChatScreen";
import { useChat } from "~/feature/chats/hooks/use-chats";
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
  const { data: chat, isLoading, error } = useChat(chatId);
  return <ChatScreen chat={chat || null} isLoading={isLoading} error={error} />;
}
