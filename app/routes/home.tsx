import { useState } from 'react';
import { Form } from 'react-router';
import type { Route } from "./+types/home";
import { getSelectedCountry, saveSelectedCountry } from "../utils/countryContext";
import type { Country } from "../components/header";
import { CountryContext } from "../components/home/CountryContext";
import { LegalInquiryForm } from "../components/home/LegalInquiryForm";
import { LegalAnswerDisplay } from "../components/home/AnswerView";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mahakama - Legal Knowledge for Everyone in South Sudan & Uganda" },
    { name: "description", content: "Get free, plain-language answers to your legal questions about South Sudan and Uganda. Understand your rights without the legal jargon. No law degree required." },
    { name: "keywords", content: "legal rights South Sudan, Uganda law, free legal advice, legal help, understand laws, tenant rights, worker rights, consumer protection, legal documents, mahakama" },
    { name: "og:title", content: "Mahakama - Legal Knowledge for Everyone in South Sudan & Uganda" },
    { name: "og:description", content: "Empowering citizens with free, easy-to-understand legal information. Know your rights in plain language before you need a lawyer." },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Mahakama - Legal Knowledge for Everyone" },
    { name: "twitter:description", content: "Demystifying the law in South Sudan and Uganda with AI-powered legal assistance in plain language." }
  ];
}

export async function action({
  request,
}: Route.ActionArgs) {
  const formData = await request.formData();
  const question = formData.get("question");
  const country = formData.get("country");

  if (!question) {
    return { error: "Question is required" };
  }

  try {
    const response = await fetch('https://makakama-api.netlify.app/.netlify/functions/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question.toString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get answer from the API');
    }

    const data = await response.json();
    return { answer: data.answer };
  } catch (error) {
    console.error('Error fetching answer:', error);
    return { error: error instanceof Error ? error.message : 'An error occurred while processing your question' };
  }
}

export default function Home({
  actionData,
}: Route.ComponentProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(getSelectedCountry());
  const [currentQuestion, setCurrentQuestion] = useState<string>('');

  console.log(actionData);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    saveSelectedCountry(country);
  };

  const handleFormSubmit = (question: string) => {
    setCurrentQuestion(question);
    // Scroll to the answer section after a short delay to allow for re-render
    setTimeout(() => {
      const answerSection = document.getElementById('answer-section');
      if (answerSection) {
        answerSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNewQuestion = () => {
    setCurrentQuestion('');
    // Reset the form if needed
    const form = document.querySelector('form');
    if (form) {
      form.reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto">
      <section className="p-6 flex-1">
        <div className="space-y-4">
          <CountryContext 
            country={selectedCountry} 
            onCountryChange={handleCountryChange} 
          />
          <div className="space-y-6">
            {!actionData?.answer && (
              <LegalInquiryForm 
                onSubmit={() => {
                  const form = document.querySelector('form');
                  if (form) {
                    const questionInput = form.querySelector('textarea[name="question"]') as HTMLTextAreaElement;
                    if (questionInput && questionInput.value.trim()) {
                      handleFormSubmit(questionInput.value.trim());
                      form.requestSubmit();
                    }
                  }
                }}
              />
            )}

            {actionData?.error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {actionData.error}
              </div>
            )}

            <div id="answer-section">
              {actionData?.answer && (
                <LegalAnswerDisplay 
                  question={currentQuestion}
                  answer={actionData.answer}
                  onNewQuestion={handleNewQuestion}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
