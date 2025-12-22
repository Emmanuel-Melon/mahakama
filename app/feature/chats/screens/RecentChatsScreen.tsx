import type { components } from "~/lib/api/generated/api.types";
import { PageLayout } from "~/layouts/page-layout";
import { ChatHeader } from "../components/ChatHeader";
import { ChatList } from "../components/ChatList";
import { useDeleteChat, useUpdateChatTitle } from "../hooks/use-chats";
export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse = components["schemas"]["ChatsCollectionResponse"];
export type ChatMessage = components["schemas"]["Message"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];


export const RecentChatsScreen = ({ chats, error }: { chats: Chat[], error: any }) => {
  const deleteChat = useDeleteChat();
  const updateChatTitle = useUpdateChatTitle();

  const handleDeleteChat = (chatId: string) => {
    deleteChat.mutate(chatId);
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    updateChatTitle.mutate({ chatId, newTitle });
  };

  return (
    <PageLayout>
        <div className="space-y-2">
          <ChatHeader />
          <ChatList
            chats={chats}
            error={error}
            onRename={handleRenameChat}
            onDelete={handleDeleteChat}
          />
        </div>
    </PageLayout>
  );
}
