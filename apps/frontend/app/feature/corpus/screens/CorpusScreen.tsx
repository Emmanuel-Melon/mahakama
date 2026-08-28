import { CorpusCollection } from "~/feature/corpus/components/corpus-collection";
import { DiagonalSeparator } from "@mah/ui/components/atoms/DiagnoalSeparator";
import { Library } from "lucide-react";
import { EmptyState, ErrorState } from "@mah/ui";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import { type Corpus } from "@mah/api/src/clients/corpus.api";
import { HeroSection } from "@mah/ui";
import type { AsyncState } from "@mah/api/src/api/api.types";

interface CorpusScreenProps extends AsyncState {
  documents: Corpus[];
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
