import type { FC } from "react";
import { LawyersList } from "~/feature/lawyers/components/lawyers-list";
import { HeroSection } from "~/layouts/HeroSection";
import { Gavel } from "lucide-react";
import EmptyState from "~/components/async-state/EmptyState";
import LoadingState from "~/components/async-state/LoadingState";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import type { components as componentsv1 } from "~/lib/api/generated/api.types";
export type Lawyer = componentsv1["schemas"]["Lawyer"];

type LawyersScreenProps = {
  lawyers: Lawyer[];
  error: any;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  displayMode: "list" | "grid";
  onDisplayModeChange: (mode: "list" | "grid") => void;
  // Filter props
  currentFilter: string;
  currentSpecialization: string;
  currentLocation: string;
  currentAvailable: string;
  currentSearch: string;
  filterOptions: Array<{ value: string; label: string; icon: any }>;
  onFilterChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onAvailableChange: (value: string) => void;
  onSearch: (value: string) => void;
  // Sort props
  currentSortField: string;
  currentSortOrder: "asc" | "desc";
  sortOptions: Array<{ value: string; label: string }>;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
};

export const LawyersScreen: FC<LawyersScreenProps> = ({
  lawyers,
  error,
  isLoading,
  isAuthenticated,
  displayMode,
  onDisplayModeChange,
  // Filter props
  currentFilter,
  currentSpecialization,
  currentLocation,
  currentAvailable,
  currentSearch,
  filterOptions,
  onFilterChange,
  onSpecializationChange,
  onLocationChange,
  onAvailableChange,
  onSearch,
  // Sort props
  currentSortField,
  currentSortOrder,
  sortOptions,
  onSortChange,
}) => {
  return (
    <div>
      {!isAuthenticated && (
        <div className="bg-background">
          <HeroSection
            title="Find Trusted Legal Professionals"
            description="Connect with vetted lawyers and legal experts in various fields of law. Get the right legal assistance for your specific needs."
            actionVariant="search"
            icon={Gavel}
          />
          <DiagonalSeparator />
        </div>
      )}
      <div>
        <div>
          {error ? (
            <ErrorState error={error} />
          ) : (
            <LawyersList
              lawyers={lawyers}
              displayMode={displayMode}
              onDisplayModeChange={onDisplayModeChange}
              variant="default"
              showControls={true}
              // Filter props
              currentFilter={currentFilter}
              currentSpecialization={currentSpecialization}
              currentLocation={currentLocation}
              currentAvailable={currentAvailable}
              currentSearch={currentSearch}
              filterOptions={filterOptions}
              onFilterChange={onFilterChange}
              onSpecializationChange={onSpecializationChange}
              onLocationChange={onLocationChange}
              onAvailableChange={onAvailableChange}
              onSearch={onSearch}
              // Sort props
              currentSortField={currentSortField}
              currentSortOrder={currentSortOrder}
              sortOptions={sortOptions}
              onSortChange={onSortChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
