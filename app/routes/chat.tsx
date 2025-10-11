import type { MetaArgs, LoaderArgs, ComponentProps, LoaderData, ChatDetails } from "./+types/chat";
import { LegalAnswerDisplay } from '~/components/home/AnswerView';
import { PageLayout } from '~/components/layouts/page-layout';

export function meta({ loaderData }: MetaArgs) {
  const { chat } = loaderData;
  return [
    { title: chat ? `Chat - ${chat.question.substring(0, 30)}...` : 'Legal Answer - Mahakama' },
    { name: 'description', content: 'View your legal answer' },
  ];
}

export async function loader(): Promise<LoaderData> {
  // Stubbed chat data for testing
  const chat: ChatDetails = {
    id: 'stub-chat-123',
    title: 'Tenant Rights Inquiry',
    question: 'What are my rights as a tenant in South Sudan?',
    answer: `In South Sudan, tenants have several rights under the law. Here's what you need to know about your rights as a tenant:\n\n1. Right to a habitable dwelling: Your landlord must maintain the property in a livable condition.\n2. Right to privacy: Your landlord must provide notice before entering the property.\n3. Protection from illegal eviction: You cannot be forced out without proper legal procedures.`,
    relevantLaws: [],
    relatedDocuments: [],
    participants: [
      {
        id: 'user-1',
        name: 'You',
        isOnline: true
      },
      {
        id: 'assistant-1',
        name: 'Legal Assistant',
        isOnline: true
      }
    ],
    messages: [
      {
        id: 'msg-1',
        content: 'What are my rights as a tenant in South Sudan?',
        senderId: 'user-1',
        senderName: 'You',
        timestamp: new Date().toISOString(),
        status: 'read'
      },
      {
        id: 'msg-2',
        content: 'In South Sudan, tenants have several rights under the law...',
        senderId: 'assistant-1',
        senderName: 'Legal Assistant',
        timestamp: new Date().toISOString(),
        status: 'read'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isGroup: false,
    unreadCount: 0
  };

  return { chat };
}

export default function ChatPage({ loaderData }: ComponentProps) {
  const { chat, error } = loaderData;

  if (error || !chat) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to load chat
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'The requested chat could not be found.'}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <LegalAnswerDisplay 
        question={chat.question}
        answer={chat.answer}
        relevantLaws={chat.relevantLaws || []}
        relatedDocuments={chat.relatedDocuments || []}
        onNewQuestion={() => window.location.href = '/'}
      />
    </PageLayout>
  );
}