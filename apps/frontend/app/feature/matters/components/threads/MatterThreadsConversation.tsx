import { useState } from "react";
import { Send } from "lucide-react";

interface ThreadMessage {
  id: string;
  senderName: string;
  senderRole: "lawyer" | "user";
  content: string;
  timestamp: string;
}

const MOCK_THREAD_MESSAGES: ThreadMessage[] = [
  {
    id: "tm1",
    senderName: "A. Pierce",
    senderRole: "lawyer",
    content:
      "We need to review the notice period compliance before taking next steps.",
    timestamp: "2026-08-30T10:15:00Z",
  },
  {
    id: "tm2",
    senderName: "Client",
    senderRole: "user",
    content: "Understood. The notice was served on the 1st of the month.",
    timestamp: "2026-08-30T10:20:00Z",
  },
];

export function MatterThreadsConversation({ threadId }: { threadId: string }) {
  const [messages, setMessages] =
    useState<ThreadMessage[]>(MOCK_THREAD_MESSAGES);
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ThreadMessage = {
      id: Date.now().toString(),
      senderName: "You",
      senderRole: "lawyer",
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        <div className="text-[10px] font-medium tracking-wider text-gray-400 uppercase border-b border-gray-100 pb-1">
          Discussion Thread: {threadId}
        </div>
        {messages.map((message) => {
          const isUser = message.senderRole === "user";
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}
            >
              <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1 px-1">
                <span className="font-semibold text-gray-700">
                  {message.senderName}
                </span>
                <span>•</span>
                <span>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div
                className={`p-3 rounded-lg text-xs max-w-[85%] ${
                  isUser
                    ? "bg-gray-50 border border-gray-200 text-gray-900"
                    : "bg-yellow-50 border border-yellow-200 text-gray-900"
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-gray-200 p-3 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message to discuss..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-black"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          aria-label="Send message"
          className="inline-flex items-center justify-center rounded-lg bg-black text-white p-2 hover:bg-gray-800 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
