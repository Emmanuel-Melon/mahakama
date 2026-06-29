import { DocumentCollection } from "~/feature/documents/components/document-collection";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { Library } from "lucide-react";
import { EmptyState } from "~/components/async-state/empty";
import { PageLoading } from "~/components/page-loading";
import { type Document } from "~/lib/api/documents.api";
import { HeroSection } from "~/layouts/HeroSection";

export const DocumentsScreen = ({
  documents,
  isLoading,
  isAuthenticated,
  displayMode,
  onDisplayModeChange,
}: {
  documents: Document[];
  isLoading?: boolean;
  isAuthenticated?: boolean;
  displayMode?: "grid" | "list";
  onDisplayModeChange?: (mode: "grid" | "list") => void;
}) => {
  if (isLoading) {
    return (
      <PageLoading
        title="Loading Legal Documents"
        description="Please wait while we fetch the latest legal documents..."
        displayMode={displayMode}
        skeletonCount={5}
      />
    );
  }

  return (
    <>
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
          {documents.length === 0 ? (
            <EmptyState
              title="No documents found"
              description="Try adjusting your search or check back later for updates."
            />
          ) : (
            <DocumentCollection
              documents={documents}
              displayMode={displayMode}
              showControls={!!onDisplayModeChange}
              onDisplayModeChange={onDisplayModeChange}
            />
          )}
        </div>
      </div>
    </>
  );
};
