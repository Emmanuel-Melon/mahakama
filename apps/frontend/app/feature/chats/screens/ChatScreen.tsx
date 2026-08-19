import { useState } from "react";
import type {
  ChatMessage,
  SendMessageRequest,
  Chat,
} from "@mah/api/clients/chat.api";
import { ActiveChatHeader } from "~/feature/chats/components/ChatHeader";
import { AnswerDisclaimer } from "~/feature/chats/components/AnswerDisclaimer";
import { ChatInput } from "~/feature/chats/components/chat-input";
import { MessageList } from "~/feature/chats/components/MessageList";
import { CitationsSidebar } from "~/feature/chats/components/CitationsSidebar";
import { UserDocumentIndicator } from "~/feature/chats/components/UserDocumentIndicator";
import { PageDetailsLoading } from "~/components/page-details-loading";
import { PageDetailsError } from "~/components/page-details-error";
import { isReplyAwaiting } from "@mah/api/hooks/use-chats";
import { useChatMutations } from "@mah/api/hooks/use-chats";
import { useUserDocumentStatus } from "@mah/api/hooks/user-documents/use-user-documents";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const sendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});
export type SendMessageForm = z.infer<typeof sendMessageSchema>;

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

  // Using the grouped mutations hook
  const {
    sendMessage: sendMessageMutation,
    deleteChat: deleteChatMutation,
    retryMessage: retryMessageMutation,
  } = useChatMutations();

  const { data: userDocumentStatus } = useUserDocumentStatus(chat?.id ?? "");

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SendMessageForm>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = watch("content");

  // Gather sources from the latest assistant message to show in the right sidebar
  const lastAssistantMessage = [...(messages || [])]
    .reverse()
    .find(
      (m) =>
        m.senderType === "assistant" ||
        !m.senderType ||
        m.metadata?.sources?.length,
    );
  const activeSources = lastAssistantMessage?.metadata?.sources || [];

  const handleRenameChat = () => {
    const newTitle = window.prompt("Enter new chat title:", chat?.title || "");
    if (newTitle && newTitle.trim() && newTitle !== chat?.title) {
      // Handle rename logic if needed
    }
  };

  const handleDeleteChat = () => {
    if (!chat) return;
    deleteChatMutation.mutate(chat.id, {
      onSuccess: () => {
        navigate("/chats/recents");
      },
    });
  };

  const handleShareChat = () => {
    if (!chat) return;
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

  const onSubmit = (data: SendMessageForm) => {
    if (!chat) return;
    const payload: SendMessageRequest = {
      chatId: chat.id,
      content: data.content,
      senderType: "user",
      userId: chat.userId,
    };

    sendMessageMutation.mutate(payload, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const lastMessage = messages?.[messages.length - 1];
  const isReplyPending = lastMessage ? isReplyAwaiting(lastMessage) : false;
  const showTyping = sendMessageMutation.isPending || isReplyPending;

  // Citation focus state for sidebar highlighting
  const [focusedCitation, setFocusedCitation] = useState<number | null>(null);

  const handleCitationClick = (index: number) => {
    const el = document.getElementById(`citation-${index + 1}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFocusedCitation(index);
    setTimeout(() => setFocusedCitation(null), 1500);
  };

  const citationMessageId = lastAssistantMessage?.id ?? undefined;

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
    <div className="flex flex-1 min-h-0 w-full overflow-hidden bg-background">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-h-0 border-r">
        <div className="flex-shrink-0 sticky top-0 z-10">
          <ActiveChatHeader
            title={chat.title!}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
            onShareChat={handleShareChat}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl p-4 pb-8">
            <MessageList
              messages={messages || []}
              isLoading={messagesLoading}
              showTyping={showTyping}
              onRetry={(messageId) =>
                retryMessageMutation.mutate({ messageId, chatId: chat.id })
              }
              isRetrying={retryMessageMutation.isPending}
              citationMessageId={citationMessageId}
              onCitationClick={handleCitationClick}
            />
          </div>
        </div>

        <div className="flex-shrink-0 sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
          <div className="max-w-4xl mx-auto w-full">
            {userDocumentStatus?.hasDocument && (
              <UserDocumentIndicator
                filename={userDocumentStatus.filename}
                totalChunks={userDocumentStatus.totalChunks}
                sessionId={chat.id}
              />
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <ChatInput
                value={messageContent || ""}
                onChange={(value) => setValue("content", value)}
                onSubmit={() => handleSubmit(onSubmit)()}
                sessionId={chat.id}
                placeholder="Ask a legal question or paste a clause to analyze..."
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

      {/* Right Sidebar for Source Citations */}
      <CitationsSidebar
        sources={activeSources}
        focusedCitation={focusedCitation}
      />
    </div>
  );
};
