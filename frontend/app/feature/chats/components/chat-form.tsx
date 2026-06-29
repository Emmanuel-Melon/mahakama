import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schemas } from "~/lib/api/generated/api.schemas";
import type { CreateChatRequest } from "~/lib/api/chat.api";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import { Separator } from "~/components/ui/separator";
import { UploadDropdown } from "~/components/ui/upload-dropdown";
import { Button } from "~/components/ui/button";

const createChatRequestSchema = schemas.postV1chats_Body;

interface ChatFormProps {
  onSubmit: (data: CreateChatRequest) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export const ChatForm = ({ onSubmit, isSubmitting, disabled = false }: ChatFormProps) => {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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

  const onFormSubmit = (data: CreateChatRequest) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="w-full">
        <InputGroup className="border rounded-xl">
          <InputGroupTextarea
            id="message"
            {...register("message")}
            placeholder="Describe your legal situation in detail..."
            className="min-h-[50px] font-medium"
            required
            disabled={disabled}
          />
          <InputGroupAddon align="block-end">
            <UploadDropdown
              onFileUpload={handleFileUpload}
              disabled={isSubmitting || disabled}
            />
            <InputGroupText className="ml-auto font-medium">Auto</InputGroupText>
            <Separator orientation="vertical" className="!h-4" />
            <InputGroupButton
              type="submit"
              variant="default"
              className="rounded-full bg-blue-600 hover:bg-blue-700 border-2 border-gray-900 shadow-[2px_2px_0_0_#000]"
              size="icon-xs"
              disabled={!question?.trim() || isSubmitting || disabled}
              onClick={handleSubmit(onFormSubmit)}
            >
              {isSubmitting ? (
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
    </div>
  );
};
