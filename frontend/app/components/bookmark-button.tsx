import { Bookmark } from "lucide-react";
import { Toggle } from "~/components/ui/toggle";

interface BookmarkButtonProps {
    onClick: (e: React.MouseEvent) => void;
    isBookmarked?: boolean;
    bookmarkCount?: number;
    className?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function BookmarkButton({
    onClick,
    isBookmarked = false,
    bookmarkCount,
    className = "",
    size = "md"
}: BookmarkButtonProps) {
    return (
        <Toggle
            onClick={onClick}
            aria-label={isBookmarked ? "Bookmarked" : "Bookmark document"}
            size="lg"
            variant="outline"
            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 rounded-full"

        >
            <Bookmark />
            {bookmarkCount !== undefined && (
                <span className="text-xs ml-1 text-gray-500">
                    {bookmarkCount}
                </span>
            )}
        </Toggle>
    );
}
