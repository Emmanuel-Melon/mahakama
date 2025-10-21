
import type { Route } from "./+types/recents";
import { useNavigate } from "react-router";
import { ChatHeader, ChatList } from "~/components/chat";
import { chatApi } from '~/lib/api/chat.api';

export async function loader() {
  try {
    const chats = await chatApi.getChats();
    return { chats };
  } catch (error) {
    console.error('Error loading chats:', error);
    return { 
      chats: [],
      error: error instanceof Error ? error.message : 'Failed to load chats'
    };
  }
}

export function meta() {
  return [
    { title: "Recent Chats - Mahakama" },
    { 
      name: "description", 
      content: "View your recent legal consultations and chat history on Mahakama" 
    },
  ];
}

export default function RecentChats({ loaderData }: Route.ComponentProps) {
  const { chats, error } = loaderData;
  const navigate = useNavigate();

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      await chatApi.updateChatTitle(chatId, newTitle);
      // Optionally refetch chats or update local state
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error('Failed to rename chat:', error);
      // TODO: Show error toast/message
      throw error; // Re-throw to let the component handle the error
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await chatApi.deleteChat(chatId);
      // Optionally refetch chats or update local state
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error('Failed to delete chat:', error);
      // TODO: Show error toast/message
      throw error; // Re-throw to let the component handle the error
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col max-w-6xl mx-auto px-6 py-8">
      <div className="space-y-8">
        <ChatHeader />
        <ChatList 
          chats={chats}
          error={error}
          onRename={handleRenameChat}
          onDelete={handleDeleteChat}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}