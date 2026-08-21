import { useState, useEffect } from "react";
import { CorpusCard } from "./corpus-card";
import { ListControls } from "~/components/organisms/list-controls";
import { type Document } from "@mah/api/src/clients/documents.api";

interface CorpusCollectionProps {
  documents: Document[];
  displayMode?: "list" | "grid";
  variant?: "default" | "minimal";
  showControls?: boolean;
  onDisplayModeChange?: (mode: "list" | "grid") => void;
}

export function CorpusCollection({
  documents,
  displayMode: externalDisplayMode = "grid",
  variant = "default",
  showControls = true,
  onDisplayModeChange,
}: CorpusCollectionProps) {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">(
    externalDisplayMode,
  );

  useEffect(() => {
    setDisplayMode(externalDisplayMode);
  }, [externalDisplayMode]);

  const handleDisplayModeChange = (mode: "list" | "grid") => {
    setDisplayMode(mode);
    onDisplayModeChange?.(mode);
  };
  return (
    <div className="space-y-6">
      {showControls && (
        <ListControls
          totalItems={documents.length}
          label="Legal Documents"
          displayMode={displayMode}
          onDisplayModeChange={handleDisplayModeChange}
        />
      )}

      {displayMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <CorpusCard
              key={doc.id}
              document={doc}
              displayMode="grid"
              variant={variant}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <CorpusCard
              key={doc.id}
              document={doc}
              displayMode="list"
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
