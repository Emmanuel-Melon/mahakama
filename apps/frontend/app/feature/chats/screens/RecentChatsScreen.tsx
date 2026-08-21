import type { Chat } from "@mah/api/src/clients/chat.api";
import { ChatListHeader } from "../components/ChatHeader";
import { ChatList } from "../components/ChatList";
import { useChatMutations } from "@mah/api/src/hooks/chats/use-chats";
import type { AsyncState } from "@mah/api/src/api/api.types";

interface RecentChatsScreenProps extends AsyncState {
  chats: Chat[];
}

export const RecentChatsScreen = ({ chats, error }: RecentChatsScreenProps) => {
  // Destructure deleteChat and updateChatTitle from the grouped mutations hook
  const {
    deleteChat: deleteChatMutation,
    updateChatTitle: updateChatTitleMutation,
  } = useChatMutations();

  const handleDeleteChat = (chatId: string) => {
    deleteChatMutation.mutate(chatId);
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    updateChatTitleMutation.mutate({ id: chatId, title: newTitle });
  };

  return (
    <div className="space-y-2">
      <ChatListHeader title="Recent Chats" />
      <ChatList
        chats={chats}
        error={error}
        onRename={handleRenameChat}
        onDelete={handleDeleteChat}
        isLoading={false}
      />
    </div>
  );
};
