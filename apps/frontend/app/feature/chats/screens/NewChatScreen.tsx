import { useNavigate } from "react-router";
import { useChatMutations } from "@mah/api/src/hooks/chats/use-chats";
import type { CreateChatRequest } from "@mah/api/src/clients/chat.api";
import { ChatForm, SuggestedQuestions } from "../components";
import { IconContainer } from "@mah/ui/components/IconContainer";
import { Scale } from "lucide-react";

export const NewChatScreen = () => {
  const navigate = useNavigate();

  // Destructure createChat from the grouped mutations hook
  const { createChat: createChatMutation } = useChatMutations();

  const handleFormSubmit = (data: CreateChatRequest) => {
    createChatMutation.mutate(data, {
      onSuccess: (newChat) => {
        navigate(`/chats/${newChat.id}`);
      },
      onError: () => {
        // Error is handled by the hook's default message configuration
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
