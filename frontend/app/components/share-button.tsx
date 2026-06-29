import { Share } from "lucide-react";
import { Toggle } from "~/components/ui/toggle";

interface ShareButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isShared?: boolean;
  shareCount?: number;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function ShareButton({
  onClick,
  isShared = false,
  shareCount,
  className = "",
  size = "md",
}: ShareButtonProps) {
  return (
    <Toggle
      onClick={onClick}
      aria-label={isShared ? "Shared" : "Share document"}
      size="lg"
      variant="default"
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-green-500 data-[state=on]:*:[svg]:stroke-green-500 rounded-full"
    >
      <Share />
      {shareCount !== undefined && (
        <span className="text-xs ml-1 text-gray-500">{shareCount}</span>
      )}
    </Toggle>
  );
}
