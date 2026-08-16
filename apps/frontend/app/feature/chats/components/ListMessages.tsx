import React, { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "@mah/api/chat.api";

export const ListMessages = () => {
  const [showProblem, setShowProblem] = useState(false);
  const [messageCount, setMessageCount] = useState(100);

  // Generate dummy messages
  const messages: ChatMessage[] = Array.from(
    { length: messageCount },
    (_, i) => ({
      id: `message-${i}`,
      chatId: `chat-${Math.floor(i / 10)}`, // Group messages into chats
      content: `This is message number ${i + 1}. Here's some sample content to make it look more realistic!`,
      userId: i % 2 === 0 ? "user-1" : "user-2", // Alternate between two users
      timestamp: new Date(
        Date.now() - (messageCount - i) * 60000,
      ).toISOString(), // Messages from last 100 minutes
      senderType: i % 2 === 0 ? "user" : "user",
      metadata: {}, // Add empty metadata object to satisfy required property
    }),
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default ListMessages;
