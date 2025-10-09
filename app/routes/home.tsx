import { useState } from 'react';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mahakama - Legal Assistance Platform" },
    { name: "description", content: "Democratizing legal access through human-centered engineering. Understand your legal rights in plain language with our AI-powered legal assistance platform." },
    { name: "keywords", content: "legal assistance, legal rights, law help, legal documents, legal advice, mahakama, court, legal aid" },
  ];
}

export default function Home() {
  const [inquiry, setInquiry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.trim()) return;
    
    setIsSubmitting(true);
    console.log('Legal inquiry submitted:', inquiry);
    
    // Simulate API call
    setTimeout(() => {
      setInquiry('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="max-w-4xl mx-auto p-6">
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Legal Inquiry</h2>
        <p className="text-gray-600 mb-6">
          Describe your legal question or concern in the box below. Our system will analyze your inquiry and provide helpful information.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="legal-inquiry" className="block text-sm font-medium text-gray-700 mb-2">
              Your Legal Question
            </label>
            <textarea
              id="legal-inquiry"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your legal question here..."
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !inquiry.trim()}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isSubmitting || !inquiry.trim()
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
