import type { Route } from "./+types/index";
import { MessagesScreens } from "~/feature/chats/screens/Messages";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Messages - Mahakama" },
    {
      name: "description",
      content: "View your legal consultations and messages",
    },
  ];
}

export default function MessagesPage() {
  return <MessagesScreens />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
