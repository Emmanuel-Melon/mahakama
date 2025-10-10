import { useState, useEffect } from 'react';
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

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(getSelectedCountry());

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    saveSelectedCountry(country);
  };

  const handleSubmit = (inquiry: string) => {
    setIsSubmitting(true);
    console.log('Legal inquiry submitted:', inquiry);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto">
      <section className=" p-6 flex-1">
        <div className="space-y-6">
          <CountryContext 
            country={selectedCountry} 
            onCountryChange={handleCountryChange} 
          />
          <LegalInquiryForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </section>
    </div>
  );
}
