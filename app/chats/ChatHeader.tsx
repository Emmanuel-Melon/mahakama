import { useNavigate } from "react-router";
import { IconContainer } from "~/components/icon-container";
import { MessageCircle } from "lucide-react";

interface ChatHeaderProps {
  title?: string;
  description?: string;
  showNewChatButton?: boolean;
}

export function ChatHeader({
  title = "Recent Chats",
  description = "Browse through your previous legal consultations and chat history",
  showNewChatButton = true,
}: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute -left-4 -top-2 w-12 h-12 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -right-4 -bottom-2 w-12 h-12 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="flex justify-between items-start">
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            {title}
            <span
              className="inline-block w-4 h-4 ml-3 bg-primary rounded-full animate-pulse"
              style={{
                borderRadius: "50%",
                boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.4)",
                filter:
                  "drop-shadow(-1px 1px 0px rgba(0,0,0,0.1)) drop-shadow(1px -1px 0px rgba(0,0,0,0.1))",
              }}
            ></span>
          </h1>
          <div
            className="w-20 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mb-3"
            style={{
              borderRadius: "8px 4px 4px 8px",
              boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
              transform: "skewX(-2deg)",
            }}
          ></div>
          <p className="text-lg text-gray-600 max-w-2xl">{description}</p>
        </div>

        {showNewChatButton && (
          <button
            onClick={() => navigate("/chats/new")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all flex items-center space-x-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 font-bold border-2 border-primary"
            style={{
              boxShadow: "3px 3px 0px rgba(0,0,0,0.15)",
              borderRadius: "4px 8px 4px 8px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>New Chat</span>
          </button>
        )}
      </div>
    </div>
  );
}
