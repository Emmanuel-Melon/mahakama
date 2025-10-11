import type { MetaArgs, LoaderArgs, ComponentProps, LoaderData, ChatDetails } from "./+types/chat";

export function meta({ loaderData }: MetaArgs) {
  const { chat } = loaderData;
  const title = chat ? `Chat #${chat.id} - Mahakama` : 'Chat - Mahakama';
  
  return [
    { title },
    { name: "description", content: `Chat with legal experts` },
  ];
}

export async function loader({ params }: LoaderArgs): Promise<LoaderData> {
  const { chatId } = params;
  
  // Mock chat data - replace with actual API call
  const mockChat: ChatDetails = {
    id: chatId,
    title: `Chat ${chatId}`,
    participants: [
      { 
        id: '1', 
        name: 'You', 
        avatar: undefined, 
        lastSeen: new Date().toISOString(), 
        isOnline: true 
      },
      { 
        id: '2', 
        name: 'Legal Expert', 
        avatar: undefined, 
        lastSeen: new Date().toISOString(),
        isOnline: true 
      },
    ],
    messages: [
      {
        id: '1',
        content: 'Hello! How can I assist you with your legal questions today?',
        senderId: '2',
        senderName: 'Legal Expert',
        senderAvatar: undefined,
        timestamp: new Date().toISOString(),
        status: 'delivered'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isGroup: false,
    unreadCount: 0
  };

  return { chat: mockChat };
}

export default function ChatPage({ loaderData }: ComponentProps) {
  const { chat } = loaderData;
  
  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Chat not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {chat.title}
        </h1>
        <div className="border-t border-gray-200 pt-4">
          {chat.messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="font-medium">{message.senderName}</div>
              <p className="text-gray-700">{message.content}</p>
              <div className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}