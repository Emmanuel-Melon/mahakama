import { useNavigate } from "react-router";
import { Share2 } from "lucide-react";

interface ChatHeaderProps {
  title?: string;
  description?: string;
  showNewChatButton?: boolean;
  actions?: React.ReactNode;
  onShare?: () => void;
}

export function ChatHeader({
  title = "Recent Chats",
  description = "Browse through your previous legal consultations and chat history",
  showNewChatButton = true,
  actions,
  onShare,
}: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-4">
        <div className="relative flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-medium text-gray-700">
            {title}
          </h1>
          {actions}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onShare && (
            <button
              onClick={onShare}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-sm hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm font-medium border border-gray-200"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
              <span className="sm:hidden">Share</span>
            </button>
          )}
          
          {showNewChatButton && (
            <button
              onClick={() => navigate("/chats/new")}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-sm hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm font-medium border border-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3arad 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">New Chat</span>
              <span className="sm:hidden">New</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
