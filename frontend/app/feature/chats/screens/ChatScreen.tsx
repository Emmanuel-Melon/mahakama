import type { components } from "~/lib/api/generated/api.types";
import { ChatHeader } from "~/feature/chats/components/ChatHeader";
import { ChatInput } from "~/feature/chats/components/chat-input";
import { MessageList } from "~/feature/chats/components/MessageList";
import { PageDetailsLoading } from "~/components/page-details-loading";
import { PageDetailsError } from "~/components/page-details-error";
import { useSendMessage, useDeleteChat } from "../hooks/use-chats";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schemas } from "~/lib/api/generated/api.schemas";
import { useNavigate } from "react-router";
import { z } from "zod";

export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse =
  components["schemas"]["ChatsCollectionResponse"];
export type ChatMessage = components["schemas"]["Message"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];

const sendMessageRequestSchema = schemas.postV1messages_Body;
export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

export const ChatScreen = ({
  chat,
  isLoading,
  error,
  messages,
  messagesLoading,
}: {
  chat: Chat | null;
  isLoading: boolean;
  error: any;
  messages: ChatMessage[];
  messagesLoading: boolean;
}) => {
  const navigate = useNavigate();
  const sendMessageMutation = useSendMessage();
  const deleteChatMutation = useDeleteChat();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SendMessageRequest>({
    resolver: zodResolver(sendMessageRequestSchema),
    defaultValues: {
      chatId: chat?.id ?? "",
      content: "",
      senderType: "user",
      userId: chat?.userId ?? "",
    },
  });

  const messageContent = watch("content");

  const handleRenameChat = () => {
    const newTitle = window.prompt("Enter new chat title:", chat.title || "");
    if (newTitle && newTitle.trim() && newTitle !== chat.title) {
    }
  };

  const handleDeleteChat = () => {
    deleteChatMutation.mutate(chat.id, {
      onSuccess: () => {
        navigate("/chats/recents");
      },
    });
  };

  const handleFavoriteChat = () => {};

  const handleShareChat = () => {
    const shareUrl = `${window.location.origin}/chats/${chat.id}`;
    if (navigator.share) {
      navigator.share({
        title: chat.title || "Legal Consultation",
        text: "Check out this legal consultation",
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Chat link copied to clipboard!");
    }
  };

  const onSubmit = (data: SendMessageRequest) => {
    const payload = {
      ...data,
      chatId: chat.id,
      userId: chat.userId,
    };

    sendMessageMutation.mutate(payload, {
      onSuccess: () => {
        reset();
      },
      onError: (error) => {
        // Error is handled by the hook
      },
    });
  };

  // Handle loading and error states
  if (isLoading)
    return (
      <PageDetailsLoading
        title="Loading Chat"
        description="Please wait while we load your conversation..."
      />
    );
  if (error)
    return (
      <PageDetailsError
        error="Failed to load chat"
        title="Error Loading Chat"
        description="We couldn't load your conversation. Please try again."
      />
    );
  if (!chat)
    return (
      <PageDetailsError
        error="Chat not found"
        title="Chat Not Found"
        description="The conversation you're looking for doesn't exist or has been removed."
      />
    );

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-shrink-0 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <ChatHeader
          variant="chat"
          title={chat.title!}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onShareChat={handleShareChat}
        />
      </div>

      <div className="flex-1 min-h-0">
        <div className="w-full p-4 pb-8 h-full overflow-y-auto">
          <MessageList
            messages={messages || []}
            isLoading={messagesLoading}
            isSending={sendMessageMutation.isPending}
          />
        </div>
      </div>
      <div className="flex-shrink-0 sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
        <div className="max-w-4xl mx-auto w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ChatInput
              value={messageContent || ""}
              onChange={(value) => setValue("content", value)}
              onSubmit={() => handleSubmit(onSubmit)()}
              placeholder="Continue the conversation..."
              isLoading={isSubmitting || sendMessageMutation.isPending}
              disabled={isSubmitting || sendMessageMutation.isPending}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-2">
                {errors.content.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
