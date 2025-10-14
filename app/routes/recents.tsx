
import type { Route } from "./+types/recents";
import { NavLink } from "react-router";
type Chat = {
  id: string;
  title: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    content: string;
    timestamp: string;
    sender: {
      type: string;
      displayName?: string;
    };
  }>;
};

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to load chats
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Recent Chats</h1>
          <p className="text-gray-600">
            View your recent legal consultations and chat history
          </p>
        </div>

        {chats.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">You don't have any recent chats yet.</p>
            <NavLink
              to="/chat"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Start a New Chat
            </NavLink>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              
              return (
                <NavLink
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {chat.title || "Legal Consultation"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
    
                  </div>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}