import React from "react";
import { ChatItem, type Chat } from "./ChatItem";

export const ListConversations = () => {
  // Generate dummy chats that match the Chat type
  const chats: Chat[] = Array.from({ length: 20 }, (_, i) => ({
    id: `chat-${i + 1}`,
    userId: `user-${(i % 3) + 1}`, // Rotate between 3 different users
    title: `Legal Consultation ${i + 1}`,
    metadata: {}, // Add empty metadata object to satisfy required property
    updatedAt: new Date(Date.now() - i * 3600000).toISOString(), // Each chat from different hours
    createdAt: new Date(Date.now() - i * 3600000 - 86400000).toISOString(), // Created a day before updated
  }));

  const handleRename = (chatId: string, newTitle: string) => {
    console.log(`Renaming chat ${chatId} to: ${newTitle}`);
    // TODO: Implement rename functionality
  };

  const handleDelete = (chatId: string) => {
    console.log(`Deleting chat: ${chatId}`);
    // TODO: Implement delete functionality
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Conversations
          </h1>

          <div className="space-y-4">
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                onRename={(newTitle) => handleRename(chat.id, newTitle)}
                onDelete={() => handleDelete(chat.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListConversations;
