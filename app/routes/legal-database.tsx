import { useState, useMemo } from "react";
import { HeroSection } from "~/components/HeroSection";
import { DocumentCollection } from "~/components/legal-database/document-collection";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { Library, Search } from "lucide-react";
import type { Route } from "./+types/legal-database";
import { ErrorDisplay } from "~/components/async-state/error";
import { EmptyState } from "~/components/async-state/empty";

export interface LegalDocument {
  id: string; // Changed from number to string to match Document interface
  title: string;
  description: string;
  type: string;
  sections: number;
  lastUpdated: string;
  storageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: LegalDocument[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

type LoaderData = {
  documents: LegalDocument[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
  error: string | null;
  timestamp?: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Legal Database - Access South Sudan & Uganda Laws" },
    {
      name: "description",
      content:
        "Free access to comprehensive legal documents from South Sudan and Uganda. Search and browse national constitutions, criminal codes, and other essential legislation in one place.",
    },
    {
      name: "keywords",
      content:
        "South Sudan laws, Uganda legal documents, free legal texts, criminal code, constitution, labor laws, legal database, African law",
    },
    {
      name: "og:title",
      content: "Free Legal Database - South Sudan & Uganda Laws",
    },
    {
      name: "og:description",
      content:
        "Access complete legal texts from South Sudan and Uganda. Search and download official legal documents, all in one place.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Legal Database - South Sudan & Uganda" },
    {
      name: "twitter:description",
      content:
        "Your free resource for accessing and understanding the laws of South Sudan and Uganda. Search and browse legal documents with ease.",
    },
  ];
}

const API_URL =
  "https://makakama-api.netlify.app/.netlify/functions/api/documents";
const REQUEST_TIMEOUT = 10000; // 10 seconds

export async function loader(): Promise<LoaderData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // 1 hour cache
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch documents: ${response.status} ${response.statusText}`,
      );
    }

    const { data = [], meta } = (await response.json()) as ApiResponse;

    return {
      documents: Array.isArray(data) ? data : [],
      meta: {
        total: meta?.total || 0,
        limit: meta?.limit || 10,
        offset: meta?.offset || 0,
      },
      error: null,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching documents:", error);

    return {
      documents: [],
      meta: { total: 0, limit: 10, offset: 0 },
      error:
        error instanceof Error
          ? error.message
          : "Failed to load documents. Please try again later.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export default function LegalDatabase({
  loaderData,
}: {
  loaderData: LoaderData;
}) {
  const { documents, meta, error } = loaderData;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;

    const query = searchQuery.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.type.toLowerCase().includes(query) ||
        doc.lastUpdated.toString().includes(query),
    );
  }, [documents, searchQuery]);

  if (error) {
    return (
      <div className="min-h-screen">
        <HeroSection
          title="Legal Database"
          description="Access a comprehensive collection of legal documents, acts, and regulations."
          icon={Library}
        />
        <DiagonalSeparator />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorDisplay
            title="Error loading documents"
            error="Hello"
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Legal Database"
        description="Access a comprehensive collection of legal documents, acts, and regulations."
        icon={Library}
        actionVariant="search"
      />
      <DiagonalSeparator />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full">
          {filteredDocuments.length === 0 ? (
            <EmptyState
              title="No documents found"
              description="Try adjusting your search or check back later for updates."
            />
          ) : (
            <DocumentCollection documents={filteredDocuments} />
          )}
        </div>
      </div>
    </div>
  );
}
