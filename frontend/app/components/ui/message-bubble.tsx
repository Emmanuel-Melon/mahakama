import { cn } from "~/lib/utils";
import { MessageActions } from "./message-actions";

export interface MessageBubbleProps {
  children: React.ReactNode;
  isUser?: boolean;
  className?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onShare?: () => void;
}

export function MessageBubble({
  children,
  isUser = false,
  className,
  onCopy,
  onRegenerate,
  onUpvote,
  onDownvote,
  onShare,
}: MessageBubbleProps) {
  const handleCopy = () => {
    onCopy?.();
    if (!onCopy && typeof children === "string") {
      navigator.clipboard.writeText(children);
    }
  };

  return (
    <div className={cn("group relative", className)}>
      <div
        className={cn(
          "relative p-4 rounded-lg",
          isUser
            ? [
                "bg-white text-gray-900 ml-auto",
                "border-2 border-dashed border-gray-300",
              ]
            : ["bg-gray-50 text-gray-700 mr-auto", "border border-gray-200"],
        )}
      >
        {children}
      </div>

      <MessageActions
        isUser={isUser}
        onCopy={handleCopy}
        onRegenerate={onRegenerate}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
        onShare={onShare}
      />
    </div>
  );
}
