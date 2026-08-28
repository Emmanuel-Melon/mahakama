import type { Route } from "./+types/chats.recents";
import { chatApi } from "@mah/api/src/clients/chat.api";
import { parseCookies } from "@mah/api/src/api/api.utils";
import { RecentChatsScreen } from "~/feature/chats/screens/RecentChatsScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

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
    const { data: chats } = await chatApi.getChats({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { chats, error: null };
  } catch (error) {
    throw handleRouteError(error);
  }
}

export default function RecentChats({ loaderData }: Route.ComponentProps) {
  const { chats, error } = loaderData;
  return <RecentChatsScreen chats={chats} error={error} isLoading={false} />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
