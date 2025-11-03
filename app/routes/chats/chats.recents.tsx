import type { Route } from "./+types/chats.recents";
import { useNavigate } from "react-router";
import { ChatHeader, ChatList } from "~/chats";
import { chatApi } from "~/lib/api/chat.api";
import { parseCookies } from "~/lib/api/utils";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;
    const chats = await chatApi.getChats(
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return { chats };
  } catch (error) {
    console.error("Error loading chats:", error);
    return {
      chats: [],
      error: error instanceof Error ? error.message : "Failed to load chats",
    };
  }
}

export function meta() {
  return [
    { title: "Recent Chats - Mahakama" },
    {
      name: "description",
      content:
        "View your recent legal consultations and chat history on Mahakama",
    },
  ];
}

export default function RecentChats({ loaderData }: Route.ComponentProps) {
  const { chats, error } = loaderData;
  const navigate = useNavigate();
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
          onRename={() => {}}
          onDelete={() => {}}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}
