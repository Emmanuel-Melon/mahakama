import { useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type your message...",
  isLoading = false,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit} className={cn("w-full mt-4", className)}>
      <div className="relative flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "min-h-[56px] max-h-[200px] w-full pr-16 resize-none",
            "border-2 border-gray-900 focus-visible:ring-yellow-400 focus-visible:ring-2 focus-visible:ring-offset-0",
            "transition-all duration-200",
            "bg-white hover:bg-gray-50 focus:bg-white",
            "placeholder-gray-400 text-gray-900",
            "rounded-xl",
            "py-4 pl-4 pr-14",
            "shadow-[3px_3px_0_0_#000]",
          )}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
          }}
          rows={1}
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!value.trim() || isLoading}
          className={cn(
            "absolute right-2 bottom-2 w-10 h-10 p-0",
            "flex items-center justify-center",
            "bg-blue-500 hover:bg-blue-600 text-white",
            "border-2 border-gray-900",
            "rounded-lg",
            "shadow-[2px_2px_0_0_#000]",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-0",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
            "flex-shrink-0",
          )}
        >
          <span className="sr-only">Send message</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform rotate-0"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </Button>
      </div>
    </form>
  );
}
