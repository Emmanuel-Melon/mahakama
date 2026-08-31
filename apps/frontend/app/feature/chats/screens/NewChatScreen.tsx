import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreateChatStream } from "@mah/api/src/hooks/chats/use-chats.sse";
import type { CreateChatRequest } from "@mah/api/src/clients/chat.api";
import { ChatForm, SuggestedQuestions } from "../components";
import { IconContainer } from "@mah/ui/components/IconContainer";
import { Scale } from "lucide-react";

export const NewChatScreen = () => {
  const navigate = useNavigate();
  const { mutate, streamState } = useCreateChatStream();

  const isSubmitting = streamState.status === "streaming";

  useEffect(() => {
    if (streamState.chatId) {
      navigate(`/chats/${streamState.chatId}`);
    }
  }, [streamState.chatId, navigate]);

  const handleFormSubmit = (data: CreateChatRequest) => {
    mutate(data);
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
            isSubmitting={isSubmitting}
            disabled={isSubmitting}
          />
          <SuggestedQuestions
            onQuestionClick={handleSuggestedQuestion}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};
