import type { Route } from "./+types/conversationId";
import { ConversationScreen } from "~/feature/chats/screens/ConversationScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Conversation - Mahakama" },
    {
      name: "description",
      content: "View a legal consultation conversation",
    },
  ];
}

export default function ConversationPage() {
  return <ConversationScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
