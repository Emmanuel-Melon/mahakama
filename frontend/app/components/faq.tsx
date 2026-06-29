import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '~/lib/utils';
import { IconContainer } from "~/components/icon-container";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'How can I find information about my legal issue?',
    answer: 'You can use our search feature to find relevant legal information, browse our legal library by category, or connect with a legal professional for personalized guidance.'
  },
  {
    question: 'Is the legal information on this website up to date?',
    answer: 'We strive to keep all legal information current and accurate. Our content is regularly reviewed by legal professionals, but laws can change, so we recommend consulting with a lawyer for the most current advice.'
  },
  {
    question: 'How do I contact a lawyer through your platform?',
    answer: 'You can browse our directory of legal professionals and contact them directly through their profiles. Some lawyers offer free initial consultations.'
  },
  {
    question: 'Is my personal information kept confidential?',
    answer: 'Yes, we take your privacy seriously. All personal information is protected under our privacy policy and we use industry-standard security measures to keep your data safe.'
  },
  {
    question: 'Do I need to pay to use this service?',
    answer: 'Basic access to legal information and resources is free. Some services, like consultations with legal professionals, may have associated fees which will be clearly indicated.'
  },
  {
    question: 'Can I get help with court forms?',
    answer: 'Yes, we provide access to common legal forms and step-by-step guidance on how to complete them. However, for complex legal matters, we recommend consulting with an attorney.'
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center">
            <IconContainer icon={HelpCircle} color="outline" size="lg" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to common questions about our legal services and resources.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className={cn(
                'bg-white border-2 border-gray-900 rounded-lg overflow-hidden transition-all duration-200',
                openIndex === index ? 'shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : 'hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
              )}
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-${index}`}
              >
                <span className="text-lg font-semibold text-gray-900">{item.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <div
                id={`faq-${index}`}
                className={cn(
                  'px-6 pb-4 pt-0 transition-all duration-200',
                  openIndex === index ? 'block' : 'hidden'
                )}
                aria-hidden={openIndex !== index}
              >
                <p className="text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border-2 border-gray-900 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};