import { useState } from 'react';

interface LegalInquiryFormProps {
  onSubmit: (inquiry: string) => void;
  isSubmitting: boolean;
}

const EXAMPLE_QUESTIONS = [
  "What can I do if my landlord won't return my deposit?",
  "What are my rights if I'm injured at work?",
  "How do I file for divorce in this country?",
  "What should I do if I can't pay my rent this month?",
  "How do I report workplace discrimination?"
];

export function LegalInquiryForm({ onSubmit, isSubmitting }: LegalInquiryFormProps) {
  const [inquiry, setInquiry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.trim()) return;
    onSubmit(inquiry);
  };

  const handleExampleClick = (question: string) => {
    setInquiry(question);
    // Auto-focus the textarea after selecting an example
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  return (
    <div 
      className="relative bg-white border-2 border-gray-900 p-6"
      style={{
        borderRadius: '8px 16px 8px 16px',
        boxShadow: '3px 3px 0 0 #000',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      {/* Corner decorations */}
      <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
      <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>
      
      <div className="relative z-10">
        <div className="relative inline-block mb-2">
          <h2 className="text-3xl font-black text-gray-900 font-serif">Ask a Legal Question</h2>
          <div className="absolute -bottom-1 left-0 right-0 h-2.5 bg-yellow-200/60 -rotate-1 transform -z-10"></div>
        </div>
        
        <p className="text-gray-700 mb-4 font-medium">
          Get plain-language answers about your rights
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              placeholder="Type your legal question here..."
              className="w-full min-h-[120px] p-4 border-2 border-gray-900 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
              style={{
                boxShadow: '2px 2px 0 0 #000',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
              }}
              disabled={isSubmitting}
              required
            />
            
            {/* Corner decorations for textarea */}
            <span className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-gray-900"></span>
            <span className="absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-900"></span>
          </div>

          {/* Example questions */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(question)}
                  className="text-xs px-3 py-1.5 border border-gray-300 bg-white rounded-full hover:bg-yellow-50 transition-colors cursor-pointer"
                  style={{
                    boxShadow: '1px 1px 0 0 #000',
                    borderColor: '#000',
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !inquiry.trim()}
              className={`relative px-6 py-3 text-sm font-bold border-2 border-gray-900 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] ${
                isSubmitting || !inquiry.trim()
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-400 hover:bg-yellow-300 text-gray-900'
              }`}
              style={{
                borderRadius: '6px 12px 6px 12px',
                boxShadow: '2px 2px 0 0 #000',
              }}
            >
              {isSubmitting ? 'Analyzing...' : 'Get Legal Insight'}
              <span className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-gray-900"></span>
              <span className="absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-900"></span>
            </button>
          </div>
        </form>
        
        <p className="mt-4 text-xs text-gray-500 text-center">
          Your privacy is protected. We'll never share your information without your consent.
        </p>
      </div>
    </div>
  );
}
