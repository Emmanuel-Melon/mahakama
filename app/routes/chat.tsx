import type {
  MetaArgs,
  LoaderArgs,
  ComponentProps,
  LoaderData,
  ChatDetails,
} from "./+types/chat";
import { LegalAnswerDisplay } from "~/components/home/AnswerView";
import { chatApi } from "~/lib/api/chat.api";

export function meta({ loaderData }: MetaArgs) {
  const { chat } = loaderData;
  return [
    {
      title: chat
        ? `Chat - ${chat.title?.substring(0, 30) || "Chat"}`
        : "Legal Answer - Mahakama",
    },
    { name: "description", content: "View your legal answer" },
  ];
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { chatId: string };
}) {
  const { chatId } = params;
  const formData = await request.formData();
  const message = formData.get("message") as string;

  try {
    const result = await chatApi.sendMessage(chatId, message);
    return { success: true, chat: result.chat };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}

export async function loader({ params }: LoaderArgs) {
  try {
    const { chatId } = params;
    if (!chatId) {
      throw new Error("Chat ID is required");
    }

    const { chat: apiChat } = await chatApi.getChatById(chatId);
    console.log("got chat data:", apiChat);
    const firstMessage = apiChat.messages?.[0]?.content || "";
    const answer =
      apiChat.messages?.find((m: any) => m.sender?.type === "assistant")
        ?.content || "";

    const chat: ChatDetails = {
      id: apiChat.id,
      title: apiChat.title || "Legal Consultation",
      question: firstMessage,
      answer: apiChat.messages || [],
      relevantLaws: [],
      relatedDocuments: [],
      participants: [
        {
          id: "user-1",
          name: "You",
          isOnline: true,
        },
        {
          id: "assistant-1",
          name: "Legal Assistant",
          isOnline: true,
        },
      ],
      messages: (apiChat.messages || []).map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.sender?.type === "assistant" ? "assistant-1" : "user-1",
        senderName:
          msg.sender?.displayName ||
          (msg.sender?.type === "assistant" ? "Legal Assistant" : "You"),
        timestamp: msg.timestamp,
        status: "read",
      })),
      createdAt: apiChat.createdAt,
      updatedAt: apiChat.updatedAt,
      isGroup: false,
      unreadCount: 0,
    };

    return { chat };
  } catch (error) {
    console.error("Error loading chat:", error);
    return {
      chat: null,
      error: error instanceof Error ? error.message : "Failed to load chat",
    };
  }
}

export default function ChatPage({ loaderData }: ComponentProps) {
  const { chat, error } = loaderData;

  if (error || !chat) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to load chat
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The requested chat could not be found."}
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LegalAnswerDisplay
      question={chat.question}
      answer={chat.answer}
      relevantLaws={chat.relevantLaws || []}
      relatedDocuments={chat.relatedDocuments || []}
      onNewQuestion={() => (window.location.href = "/")}
    />
  );
}
