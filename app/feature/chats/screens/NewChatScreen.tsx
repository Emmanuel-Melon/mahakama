import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

import { MessageCircle, ArrowRight, Sparkles, ArrowUp } from "lucide-react";
import { PageLayout } from "~/layouts/page-layout";
import { useCreateChat } from "../hooks/use-chats";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schemas } from "~/lib/api/generated/api.schemas";
import type { components } from "~/lib/api/generated/api.types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import { Separator } from "~/components/ui/separator";
import { UploadDropdown } from "~/components/ui/upload-dropdown";
export type Chat = components["schemas"]["Chat"];
export type ChatResource = components["schemas"]["ChatResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type ChatsCollectionResponse = components["schemas"]["ChatsCollectionResponse"];
export type ChatMessage = components["schemas"]["Message"];
export type CreateChatRequest = components["schemas"]["CreateChatRequest"];
const createChatRequestSchema = schemas.postV1chats_Body;

const suggestedQuestions = [
  "What are my rights as a tenant in a rental dispute?",
  "How do I file for divorce and what documents do I need?",
  "What are the penalties for traffic violations?",
  "How can I protect my business intellectual property?",
];

export const NewChatScreen = () => {
  const navigate = useNavigate();
  const createChatMutation = useCreateChat();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateChatRequest>({
    resolver: zodResolver(createChatRequestSchema),
  });

  const question = watch("message");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSuggestedQuestion = (q: string) => {
    setValue("message", q);
    handleSubmit(onSubmit)();
  };

  const onSubmit = (data: CreateChatRequest) => {
    createChatMutation.mutate(data, {
      onSuccess: (newChat) => {
        navigate(`/chats/${newChat.id}`);
      },
      onError: (error) => {
        // Error is handled by the hook
      },
    });
  };

  return (
    <PageLayout>
      <div className="space-y-2">
        <div className="w-full">
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-bold text-gray-700 mb-3"
              >
                What's your legal question?
              </label>

              <div className="w-full">
                <InputGroup className="border-2 border-gray-900 shadow-[2px_2px_0_0_#000]" style={{ borderRadius: "4px 8px 4px 8px" }}>
                  <InputGroupTextarea
                    id="message"
                    {...register("message")}
                    placeholder="Describe your legal situation in detail..."
                    className="min-h-[150px] font-medium"
                    required
                  />
                  <InputGroupAddon align="block-end">
                    <UploadDropdown
                      onFileUpload={handleFileUpload}
                      disabled={isSubmitting || createChatMutation.isPending}
                    />
                    <InputGroupText className="ml-auto font-medium">Auto</InputGroupText>
                    <Separator orientation="vertical" className="!h-4" />
                    <InputGroupButton
                      type="submit"
                      variant="default"
                      className="rounded-full bg-blue-600 hover:bg-blue-700 border-2 border-gray-900 shadow-[2px_2px_0_0_#000]"
                      size="icon-xs"
                      disabled={!question?.trim() || isSubmitting || createChatMutation.isPending}
                    >
                      {isSubmitting || createChatMutation.isPending ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ArrowUp className="w-3 h-3" />
                      )}
                      <span className="sr-only">Send</span>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              {attachedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Attached files:</p>
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {errors.message && (
                <p className="text-red-500 text-sm mt-2">{errors.message.message}</p>
              )}
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
            Or try one of these:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(q)}
                className="text-left p-4 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-all hover:shadow-md text-gray-700 hover:text-gray-900 font-medium text-sm"
                style={{
                  boxShadow: "2px 2px 0 0 #000",
                  borderRadius: "4px 8px 4px 8px",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span>{q}</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
