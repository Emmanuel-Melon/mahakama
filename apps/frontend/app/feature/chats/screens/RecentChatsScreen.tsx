import type {
  Chat,
  ChatResource,
  ChatSingleResponse,
  ChatsCollectionResponse,
  CreateChatRequest,
} from "@mah/api/chat.api";
import { ChatListHeader } from "../components/ChatHeader";
import { ChatList } from "../components/ChatList";
import { useDeleteChat, useUpdateChatTitle } from "../hooks/use-chats";

export const RecentChatsScreen = ({
  chats,
  error,
}: {
  chats: Chat[];
  error: any;
}) => {
  const deleteChat = useDeleteChat();
  const updateChatTitle = useUpdateChatTitle();

  const handleDeleteChat = (chatId: string) => {
    deleteChat.mutate(chatId);
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    updateChatTitle.mutate({ chatId, newTitle });
  };

  return (
    <div className="space-y-2">
      <ChatListHeader title="Recent Chats" />
      <ChatList
        chats={chats}
        error={error}
        onRename={handleRenameChat}
        onDelete={handleDeleteChat}
      />
    </div>
  );
};
