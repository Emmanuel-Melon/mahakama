
import type { Route } from "./+types/recents";
import { NavLink, useNavigate } from "react-router";
import { History, MoreVertical, Pencil, Trash2, MessageSquare } from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type Chat = {
  id: string;
  title: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    content: string;
    timestamp: string;
    sender: {
      type: string;
      displayName?: string;
    };
  }>;
};

type LoaderData = {
  chats: Chat[];
  error?: string;
};

export async function loader() {
  try {
    const response = await fetch(
      "https://makakama-api.netlify.app/.netlify/functions/api/chats/"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chats: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.status !== "success" || !result.data?.chats) {
      throw new Error("Invalid data received from the server");
    }

    // Sort chats by updatedAt in descending order (newest first)
    const sortedChats = [...result.data.chats].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return { chats: sortedChats };
  } catch (error) {
    console.error('Error loading chats:', error);
    return { 
      chats: [],
      error: error instanceof Error ? error.message : "Failed to load chats" 
    };
  }
}

export function meta() {
  return [
    { title: "Recent Chats - Mahakama" },
    { 
      name: "description", 
      content: "View your recent legal consultations and chat history on Mahakama" 
    },
  ];
}

export default function RecentChats({ loaderData }: Route.ComponentProps) {
  const { chats, error } = loaderData;
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="py-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to load chats
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-6 py-8">
      <div className="space-y-8">
        <div className="relative">
          <div className="absolute -left-4 -top-2 w-12 h-12 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -right-4 -bottom-2 w-12 h-12 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          
          <div className="flex justify-between items-start">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
                Recent Chats
                <span className="inline-block w-3 h-3 ml-2 bg-primary rounded-full animate-pulse"></span>
              </h1>
              <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mb-3"></div>
              <p className="text-lg text-gray-600 max-w-2xl">
                Browse through your previous legal consultations and chat history
              </p>
            </div>
            
            <button
              onClick={() => navigate('/chat')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {chats.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent chats</h3>
            <p className="text-gray-500 mb-6">Your chat history will appear here</p>
            <button
              onClick={() => navigate('/chat')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Start a New Chat
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              
              return (
                <div key={chat.id} className="group relative">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-center">
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => navigate(`/chat/${chat.id}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {chat.title || "Legal Consultation"}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400 whitespace-nowrap font-mono">
                          {formatDate(chat.updatedAt)}
                        </span>
                        
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button 
                              className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenu.Trigger>
                          
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content 
                              className="min-w-[180px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50"
                              align="end"
                              sideOffset={5}
                            >
                              <DropdownMenu.Item 
                                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded cursor-pointer hover:bg-gray-100 outline-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle rename
                                  const newTitle = prompt('Enter new chat title:', chat.title || 'Legal Consultation');
                                  if (newTitle && newTitle !== chat.title) {
                                    // Update chat title logic here
                                    console.log('Renaming chat to:', newTitle);
                                  }
                                }}
                              >
                                <Pencil className="w-4 h-4 mr-2 text-gray-500" />
                                Rename
                              </DropdownMenu.Item>
                              
                              <DropdownMenu.Separator className="h-px bg-gray-200 m-1" />
                              
                              <DropdownMenu.Item 
                                className="flex items-center px-3 py-2 text-sm text-red-600 rounded cursor-pointer hover:bg-red-50 outline-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this chat?')) {
                                    // Delete chat logic here
                                    console.log('Deleting chat:', chat.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </div>
                    
                    <div 
                      className="mt-2 flex items-center text-xs text-gray-400 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/chat/${chat.id}`)}
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      <span>{chat.messages.length} messages</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}