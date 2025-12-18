import type { components } from "~/lib/api/generated/api.types";
import { PageLayout } from "~/layouts/page-layout";
import { ChatHeader } from "~/feature/chats/components/ChatHeader";
import { ChatInput } from "~/feature/chats/components/chat-input";
import { MessageList } from "~/feature/chats/components/MessageList";
import { ChatActionsDropdown } from "~/feature/chats/components/ChatActionsDropdown";
import { useSendMessage, useMessages, useDeleteChat } from "../hooks/use-chats";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schemas } from "~/lib/api/generated/api.schemas";
import { useState } from "react";
import { useNavigate } from "react-router";

export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse = components["schemas"]["ChatsCollectionResponse"];
export type ChatMessage = components["schemas"]["Message"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];
export type SendMessageRequest = components["schemas"]["SendMessageRequest"];
const sendMessageRequestSchema = schemas.postV1messages_Body;

export const ChatScreen = ({ chat }: { chat: Chat }) => {
  const navigate = useNavigate();
  const sendMessageMutation = useSendMessage();
  const deleteChatMutation = useDeleteChat();
  const { data: messages, isLoading: messagesLoading } = useMessages(chat.id);

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
      chatId: chat.id,
      sender: {
        id: chat.userId,
        type: "user",
      },
    },
  });

  const messageContent = watch("content");

  const handleRenameChat = () => {
    const newTitle = window.prompt('Enter new chat title:', chat.title || '');
    if (newTitle && newTitle.trim() && newTitle !== chat.title) {
      // TODO: Implement rename API call
      console.log('Rename chat to:', newTitle.trim());
      // For now, we'll just log it. In a real implementation, you'd call an API
      // and update the chat state to reflect the new title
    }
  };

  const handleDeleteChat = () => {
    if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      deleteChatMutation.mutate(chat.id, {
        onSuccess: () => {
          navigate('/chats');
        },
      });
    }
  };

  const handleFavoriteChat = () => {
    // TODO: Implement favorite functionality
    console.log('Favorite chat:', chat.id);
  };

  const handleShareChat = () => {
    // TODO: Implement share functionality
    const shareUrl = `${window.location.origin}/chats/${chat.id}`;
    if (navigator.share) {
      navigator.share({
        title: chat.title || 'Legal Consultation',
        text: 'Check out this legal consultation',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Chat link copied to clipboard!');
    }
  };

  const onSubmit = (data: SendMessageRequest) => {
    const payload = {
      ...data,
      chatId: chat.id,
      sender: {
        id: chat.userId,
        type: "user" as const,
      },
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

  return (
    <PageLayout>
      <div className="w-full">
        <div className="w-full">
          <ChatHeader
            title={chat.title!}
            showNewChatButton={false}
            onShare={handleShareChat}
            actions={
              <ChatActionsDropdown
                chatId={chat.id}
                onDelete={handleDeleteChat}
                onFavorite={handleFavoriteChat}
                onRename={handleRenameChat}
              />
            }
          />
          
          {/* Messages Section */}
          <div className="bg-white border-2 border-gray-900 rounded-lg p-6 mb-8" style={{
            boxShadow: "2px 2px 0 0 #000",
            borderRadius: "4px 8px 4px 8px",
          }}>
            <div className="max-h-96 overflow-y-auto">
              <MessageList messages={messages || []} isLoading={messagesLoading} />
            </div>
          </div>
          
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
                <p className="text-red-500 text-sm mt-2">{errors.content.message}</p>
              )}
            </form>
        </div>
      </div>
    </PageLayout>
  );
}
