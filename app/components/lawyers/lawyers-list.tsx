import { useState, useEffect } from "react";
import { LawyerCard } from "./lawyer-card";
import { ListControls } from "../list-controls";
import type { Lawyer } from "app/types/lawyer";

interface LawyersListProps {
  lawyers: Lawyer[];
  displayMode?: "list" | "grid";
  variant?: "default" | "minimal";
  showControls?: boolean;
}

export function LawyersList({
  lawyers = [],
  displayMode: externalDisplayMode = "list",
  variant = "default",
  showControls = true,
}: LawyersListProps) {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">(
    externalDisplayMode,
  );

  useEffect(() => {
    setDisplayMode(externalDisplayMode);
  }, [externalDisplayMode]);

  return (
    <div className="space-y-6">
      {showControls && (
        <ListControls
          totalItems={lawyers.length}
          itemName="lawyer"
          displayMode={displayMode}
          onDisplayModeChange={setDisplayMode}
        />
      )}

      {displayMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="h-full">
              <LawyerCard
                lawyer={lawyer}
                variant={variant}
                displayMode="grid"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {lawyers.map((lawyer) => (
            <LawyerCard
              key={lawyer.id}
              lawyer={lawyer}
              variant={variant}
              displayMode="list"
            />
          ))}
        </div>
      )}
    </div>
  );
}
