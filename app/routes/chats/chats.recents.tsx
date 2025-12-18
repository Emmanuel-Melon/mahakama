import type { Route } from "./+types/chats.recents";
import { chatApi } from "~/lib/api/chat.api";
import { parseCookies } from "~/lib/api/utils";
import { RecentChatsScreen } from "~/feature/chats/screens/RecentChatsScreen";

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

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;
    const chats = await chatApi.getChats({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { chats };
  } catch (error) {
    console.error("Error loading chats:", error);
    return {
      chats: [],
      error: error instanceof Error ? error.message : "Failed to load chats",
    };
  }
}

export default function RecentChats({ loaderData }: Route.ComponentProps) {
  const { chats, error } = loaderData;
  return (
    <RecentChatsScreen chats={chats} error={error} />
  );
}
