import { useState } from 'react';
import { Form } from 'react-router';
import type { Route } from "./+types/home";
import { getSelectedCountry, saveSelectedCountry } from "../utils/countryContext";
import type { Country } from "../components/header";
import { CountryContext } from "../components/home/CountryContext";
import { LegalInquiryForm } from "../components/home/LegalInquiryForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mahakama - Legal Assistance Platform" },
    { name: "description", content: "Democratizing legal access through human-centered engineering. Understand your legal rights in plain language with our AI-powered legal assistance platform." },
    { name: "keywords", content: "legal assistance, legal rights, law help, legal documents, legal advice, mahakama, court, legal aid" },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
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
        question: question.toString(),
        country: country?.toString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get answer');
    }

    const data = await response.json();
    return { answer: data.answer };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export default function Home({
  actionData,
}: Route.ComponentProps) {


  const [selectedCountry, setSelectedCountry] = useState<Country>(getSelectedCountry());

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    saveSelectedCountry(country);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto">
      <section className="p-6 flex-1">
        <div className="space-y-4">
          <CountryContext 
            country={selectedCountry} 
            onCountryChange={handleCountryChange} 
          />
          <Form method="post" className="space-y-6">
            <input type="hidden" name="country" value={selectedCountry.code} />
            <LegalInquiryForm 
            />
            {actionData?.error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {actionData.error}
              </div>
            )}
            {actionData?.answer && (
              <div className="mt-6 p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Answer:</h3>
                <p className="text-gray-700">{actionData.answer}</p>
              </div>
            )}
          </Form>
        </div>
      </section>
    </div>
  );
}
