import { useState, useMemo } from "react";
import { DocumentCollection } from "~/feature/documents/components/document-collection";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { Library } from "lucide-react";
import { ErrorState } from "~/components/async-state/error";
import { EmptyState } from "~/components/async-state/empty";
import { documentsApi, type Document } from "~/lib/api/documents.api";
import { parseCookies } from "~/lib/api/utils";
import { HeroSection } from "~/layouts/HeroSection";
import { PageLayout } from "~/layouts/page-layout";


export const DocumentsScreen = ({ documents, error, isLoading, isAuthenticated }: { 
  documents: Document[], 
  error: any, 
  isLoading?: boolean,
  isAuthenticated?: boolean 
}) => {
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

  if (isLoading) {
    return (
      <PageLayout>
        {!isAuthenticated && (
          <div className="bg-background">
            <HeroSection
              title="Legal Database"
              description="Free access to comprehensive legal documents from South Sudan and Uganda. Search and browse national constitutions, criminal codes, and other essential legislation in one place."
              actionVariant="search"
              icon={Library}
            />
            <DiagonalSeparator />
          </div>
        )}
        <div className="w-full bg-background/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        {!isAuthenticated && (
          <>
            <HeroSection
              title="Legal Database"
              description="Access a comprehensive collection of legal documents, acts, and regulations."
              icon={Library}
            />
            <DiagonalSeparator />
          </>
        )}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorState
            title="Error loading documents"
            error="Hello"
            onRetry={() => window.location.reload()}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {!isAuthenticated && (
        <>
          <HeroSection
            title="Legal Database"
            description="Access a comprehensive collection of legal documents, acts, and regulations."
            icon={Library}
            actionVariant="search"
          />
          <DiagonalSeparator />
        </>
      )}
      <div>
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
    </PageLayout>
  );
}
