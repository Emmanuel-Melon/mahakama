import { History } from "lucide-react";
import { useNavigate } from "react-router";

interface EmptyStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No recent chats",
  message = "Your chat history will appear here",
  buttonText = "Start a New Chat",
  onAction,
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onAction) {
      onAction();
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <History className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}
