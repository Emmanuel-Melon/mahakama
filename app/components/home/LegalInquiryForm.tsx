import { useState } from 'react';
import { ExampleQuestions, ExampleCategories } from './ExampleQuestions';

interface LegalInquiryFormProps {
  isSubmitting?: boolean;
}

export function LegalInquiryForm({ isSubmitting }: LegalInquiryFormProps) {
  const [inquiry, setInquiry] = useState('');

  const handleExampleClick = (question: string) => {
    setInquiry(question);
    // Auto-focus the textarea after selecting an example
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInquiry(e.target.value);
  };

  return (
    <section className='space-y-8'>
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

          <div className="space-y-4">
            <div className="relative">
              <textarea
                name="question"
                value={inquiry}
                onChange={handleTextareaChange}
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

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !inquiry.trim()}
                className={`relative px-6 py-3 text-sm font-bold border-2 border-gray-900 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] ${isSubmitting || !inquiry.trim()
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
          </div>
        </div>
      </div>
      <ExampleQuestions handleExampleClick={handleExampleClick} />
    </section>
  );
}
