import { useNavigate } from "react-router";
import { useCreateChat } from "@mah/api/hooks/use-chats";
import type { CreateChatRequest } from "@mah/api/clients/chat.api";
import { ChatForm, SuggestedQuestions } from "../components";
import { IconContainer } from "~/components/icon-container";
import { Scale } from "lucide-react";

export const NewChatScreen = () => {
  const navigate = useNavigate();
  const createChatMutation = useCreateChat();

  const handleFormSubmit = (data: CreateChatRequest) => {
    createChatMutation.mutate(data, {
      onSuccess: (newChat) => {
        navigate(`/chats/${newChat.id}`);
      },
      onError: (error) => {
        // Error is handled by the hook
      },
    });
  };

  const handleSuggestedQuestion = (question: string) => {
    handleFormSubmit({ message: question });
  };

  return (
    <div className="flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full text-center space-y-8">
          <div className="flex justify-center mb-4">
            <IconContainer icon={Scale} size="lg" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 text-center mb-8">
            What's your legal question?
          </h1>
          <ChatForm
            onSubmit={handleFormSubmit}
            isSubmitting={createChatMutation.isPending}
            disabled={createChatMutation.isPending}
          />
          <SuggestedQuestions onQuestionClick={handleSuggestedQuestion} />
        </div>
      </div>
    </div>
  );
};
