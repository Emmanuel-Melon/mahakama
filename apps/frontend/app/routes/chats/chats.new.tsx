import type { Route } from "./+types/chats.new";
import { chatApi } from "@mah/api/clients/chat.api";
import { parseCookies } from "@mah/api/api.utils";
import { NewChatScreen } from "~/feature/chats/screens/NewChatScreen";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

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

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parseCookies(cookieHeader);
  const token = cookies.token;
  const formData = await request.formData();
  const question = formData.get("question") as string;

  if (!question) {
    return { error: "Question is required" };
  }

  try {
    // Create a new chat with the question
    const chat = await chatApi.createChat(
      { message: question },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Redirect to the new chat
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/chat/${chat.id}`,
      },
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return { error: "Failed to create chat. Please try again." };
  }
}

export default function NewChat() {
  return <NewChatScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
