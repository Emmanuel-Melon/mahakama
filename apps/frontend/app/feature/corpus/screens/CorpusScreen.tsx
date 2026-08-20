import { CorpusCollection } from "~/feature/corpus/components/corpus-collection";
import { DiagonalSeparator } from "~/components/atoms/diagnoal-separator";
import { Library } from "lucide-react";
import EmptyState from "~/components/async-state/EmptyState";
import LoadingState from "~/components/async-state/LoadingState";
import { PageLoading } from "~/components/molecules/page-loading";
import { type Document } from "@mah/api/clients/documents.api";
import { HeroSection } from "~/layouts/HeroSection";
import type { AsyncState } from "@mah/api/api.types";

interface CorpusScreenProps extends AsyncState {
  documents: Document[];
  isAuthenticated?: boolean;
  displayMode?: "grid" | "list";
  onDisplayModeChange?: (mode: "grid" | "list") => void;
}

export const CorpusScreen = ({
  documents,
  isLoading,
  isAuthenticated,
  displayMode,
  onDisplayModeChange,
}: CorpusScreenProps) => {
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
            <CorpusCollection
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
