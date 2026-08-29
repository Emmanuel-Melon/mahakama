import type { Route } from "./+types/chats.recents";
import { RecentChatsScreen } from "~/feature/chats/screens/RecentChatsScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { useChats } from "@mah/api/src/hooks/chats/use-chats";

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

export default function RecentChats() {
  const { data: chats, isLoading, error } = useChats();

  return (
    <RecentChatsScreen
      chats={chats?.data ?? []}
      error={error ?? null}
      isLoading={isLoading}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
