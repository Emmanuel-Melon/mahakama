"use client";

import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { HeroSection } from "~/components/HeroSection";
import { DocumentList, AboutLegalDatabase } from "~/components/legal-database";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { Library, Loader2 } from 'lucide-react';

interface LegalDocument {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: number;
  type: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Legal Database - Access South Sudan & Uganda Laws" },
    { name: "description", content: "Free access to comprehensive legal documents from South Sudan and Uganda. Search and browse national constitutions, criminal codes, and other essential legislation in one place." },
    { name: "keywords", content: "South Sudan laws, Uganda legal documents, free legal texts, criminal code, constitution, labor laws, legal database, African law" },
    { name: "og:title", content: "Free Legal Database - South Sudan & Uganda Laws" },
    { name: "og:description", content: "Access complete legal texts from South Sudan and Uganda. Search and download official legal documents, all in one place." },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Legal Database - South Sudan & Uganda" },
    { name: "twitter:description", content: "Your free resource for accessing and understanding the laws of South Sudan and Uganda. Search and browse legal documents with ease." }
  ];
};

// Document data is now fetched from the API

export default function LegalDatabase() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://makakama-api.netlify.app/.netlify/functions/api/documents');
        
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        
        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection 
        title="Legal Database"
        description="Access a comprehensive collection of legal documents, acts, and regulations. Stay informed with the latest legal resources and references."
        actionVariant="search"
        icon={Library}
      />
      <DiagonalSeparator />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-foreground mb-2">Legal Database</h1>
          <p className="text-muted-foreground mb-8">
            Access the complete collection of laws and legal documents. Each document is available in its original form
            with version history and amendments. Our AI helps you navigate and understand these complex legal texts.
          </p>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500 mb-4" />
              <p className="text-gray-600">Loading documents...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <DocumentList documents={documents} />
              <AboutLegalDatabase />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
