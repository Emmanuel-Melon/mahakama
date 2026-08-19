import { useRef, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { UploadDropdown } from "~/components/ui/upload-dropdown";
import {
  useUploadDocument,
  getDocumentUploadKey,
} from "@mah/api/hooks/documents/use-documents";
import { AudioLines, Paperclip, Plus, Send, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  sessionId?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  sessionId,
  placeholder = "Type your message...",
  className,
  disabled = false,
  isLoading = false,
}: ChatInputProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const { uploads, upload, clearUploads, isUploading, uploadProgress } =
    useUploadDocument();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!voiceEnabled) {
        handleSubmit();
      }
    }
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    clearUploads();
  };

  const handleSubmit = async () => {
    if (attachedFile && sessionId) {
      const success = await upload(sessionId, attachedFile);
      if (!success) return;
      setAttachedFile(null);
      clearUploads();
    }
    onSubmit();
  };

  const fileProgress = attachedFile
    ? uploads[getDocumentUploadKey(attachedFile)]
    : null;

  return (
    <div className={cn("w-full", className)}>
      {attachedFile && (
        <div className="mb-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Paperclip className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-sm text-gray-700 truncate">
                {attachedFile.name}
              </span>
              {fileProgress && fileProgress.status === "uploading" && (
                <span className="text-xs text-blue-600">{uploadProgress}%</span>
              )}
              {fileProgress && fileProgress.status === "completed" && (
                <span className="text-xs text-green-600">✓</span>
              )}
              {fileProgress && fileProgress.status === "error" && (
                <span className="text-xs text-red-600">
                  {fileProgress.message ?? "Failed"}
                </span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={removeFile}
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          {fileProgress && fileProgress.status === "uploading" && (
            <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      <ButtonGroup className="[--radius:9999rem] w-full">
        <ButtonGroup className="shrink-0">
          {sessionId ? (
            <UploadDropdown
              onFileUpload={handleFileUpload}
              disabled={disabled || isLoading || isUploading}
            />
          ) : (
            <Button variant="outline" size="icon" className="rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </ButtonGroup>

        <ButtonGroup className="flex-1">
          <InputGroup className="w-full">
            <InputGroupInput
              ref={inputRef}
              value={voiceEnabled ? "" : value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                voiceEnabled ? "Record and send audio..." : placeholder
              }
              disabled={disabled || isLoading || voiceEnabled}
              className="min-h-[44px] resize-none"
            />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    onClick={handleVoiceToggle}
                    size="icon-xs"
                    data-active={voiceEnabled}
                    className={cn(
                      "data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700",
                      "dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100",
                    )}
                    aria-pressed={voiceEnabled}
                    disabled={disabled || isLoading}
                  >
                    <AudioLines className="h-4 w-4" />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>Voice Mode</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </ButtonGroup>

        {!voiceEnabled && (
          <ButtonGroup className="shrink-0">
            <Button
              onClick={handleSubmit}
              disabled={
                disabled ||
                isLoading ||
                isUploading ||
                (!value.trim() && !attachedFile)
              }
              size="icon"
              className="rounded-full"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </ButtonGroup>
        )}
      </ButtonGroup>
    </div>
  );
}
