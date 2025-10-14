
import type { Route } from "./+types/recents";
import { useNavigate } from "react-router";
import { ChatHeader, ChatList, type Chat } from "~/components/chat";

type LoaderData = {
  chats: Chat[];
  error?: string;
};

export async function loader() {
  try {
    const response = await fetch(
      "https://makakama-api.netlify.app/.netlify/functions/api/chats/"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chats: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.status !== "success" || !result.data?.chats) {
      throw new Error("Invalid data received from the server");
    }

    // Sort chats by updatedAt in descending order (newest first)
    const sortedChats = [...result.data.chats].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return { chats: sortedChats };
  } catch (error) {
    console.error('Error loading chats:', error);
    return { 
      chats: [],
      error: error instanceof Error ? error.message : "Failed to load chats" 
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
      // TODO: Implement API call to update chat title
      console.log(`Renaming chat ${chatId} to:`, newTitle);
      // Example: await updateChatTitle(chatId, newTitle);
    } catch (error) {
      console.error('Failed to rename chat:', error);
      // TODO: Show error toast/message
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      // TODO: Implement API call to delete chat
      console.log('Deleting chat:', chatId);
      // Example: await deleteChat(chatId);
      // TODO: Update local state or refetch chats
    } catch (error) {
      console.error('Failed to delete chat:', error);
      // TODO: Show error toast/message
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