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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { z } from "zod";

export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse = components["schemas"]["ChatsCollectionResponse"];
export type ChatMessage = components["schemas"]["Message"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];
 
const sendMessageRequestSchema = schemas.postV1messages_Body;
export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>

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
      content: "",
      senderType: "user",
      userId: chat.userId,
    },
  });

  const messageContent = watch("content");

  const handleRenameChat = () => {
    const newTitle = window.prompt('Enter new chat title:', chat.title || '');
    if (newTitle && newTitle.trim() && newTitle !== chat.title) {
      // TODO: Implement rename API call
      // For now, we'll just log it. In a real implementation, you'd call an API
      // and update the chat state to reflect the new title
    }
  };

  const handleDeleteChat = () => {
    deleteChatMutation.mutate(chat.id, {
      onSuccess: () => {
        navigate('/chats/recents');
      },
    });
  };

  const handleFavoriteChat = () => {
    // TODO: Implement favorite functionality
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

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]"> {/* Adjust based on your PageLayout header height */}
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <ChatHeader
            title={chat.title!}
            showNewChatButton={false}
            onShare={handleShareChat}
            actions={
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <ChatActionsDropdown
                    chatId={chat.id}
                    onDelete={() => {}} // Empty function since dialog handles confirmation
                    onFavorite={handleFavoriteChat}
                    onRename={handleRenameChat}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your chat and remove your messages from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteChat}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            }
          />
        </div>

        {/* Messages Section - Takes remaining height, no overflow here */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="max-w-4xl mx-auto w-full h-full">
            <MessageList 
              messages={messages || []} 
              isLoading={messagesLoading} 
              isSending={sendMessageMutation.isPending}
            />
          </div>
        </div>

        {/* Fixed Input */}
        <div className="flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
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
                <p className="text-red-500 text-sm mt-2">{errors.content.message}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
