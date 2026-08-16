import { useState, useRef, useEffect } from "react";
import { Trash2, Star, Share2, MoreVertical, Edit3 } from "lucide-react";

interface ChatActionsDropdownProps {
  chatId: string;
  onDelete: () => void;
  onFavorite: () => void;
  onRename: () => void;
}

export function ChatActionsDropdown({
  chatId,
  onDelete,
  onFavorite,
  onRename,
}: ChatActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
        aria-label="Chat actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleAction(onRename)}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Rename Chat</span>
            </button>

            <button
              onClick={() => handleAction(onFavorite)}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <Star className="w-4 h-4" />
              <span>Add to Favorites</span>
            </button>

            <div className="border-t border-gray-200 my-1"></div>

            <button
              onClick={() => handleAction(onDelete)}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Chat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
