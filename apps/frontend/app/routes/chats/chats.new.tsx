import type { Route } from "./+types/chats.new";
import { NewChatScreen } from "~/feature/chats/screens/NewChatScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Start New Chat - Mahakama" },
    {
      name: "description",
      content:
        "Ask a legal question and get guidance from Mahakama's AI legal assistant.",
    },
  ];
}

export default function NewChat() {
  return <NewChatScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
