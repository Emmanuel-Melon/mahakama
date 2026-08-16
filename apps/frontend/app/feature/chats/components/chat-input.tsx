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
import { AudioLines, Plus, Send } from "lucide-react";
import { cn } from "~/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type your message...",
  className,
  disabled = false,
  isLoading = false,
}: ChatInputProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
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
        onSubmit();
      }
    }
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <div className={cn("w-full", className)}>
      <ButtonGroup className="[--radius:9999rem] w-full">
        <ButtonGroup className="shrink-0">
          <Button variant="outline" size="icon" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
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
              onClick={onSubmit}
              disabled={disabled || isLoading || !value.trim()}
              size="icon"
              className="rounded-full"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </ButtonGroup>
        )}
      </ButtonGroup>
    </div>
  );
}
