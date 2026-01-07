import { LawyerCard } from "./lawyer-card";
import { ListControls } from "~/components/list-controls";
import { FilterSection } from "./filter-section";
import { EmptyState } from "~/components/async-state/empty";
import type { Lawyer } from "~/lib/api/lawyers.api";

interface LawyersListProps {
  lawyers: Lawyer[];
  displayMode: "list" | "grid";
  onDisplayModeChange: (mode: "list" | "grid") => void;
  variant?: "default" | "minimal";
  showControls?: boolean;
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
}

export function LawyersList({
  lawyers = [],
  displayMode,
  onDisplayModeChange,
  variant = "default",
  showControls = true,
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
}: LawyersListProps) {
  return (
    <div className="space-y-6">
      {showControls && (
        <ListControls
          totalItems={lawyers.length}
          itemName="lawyer"
          label="Lawyers"
          displayMode={displayMode}
          onDisplayModeChange={onDisplayModeChange}
          filterBy={currentFilter}
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
          sortBy={currentSortField}
          sortOrder={currentSortOrder}
          sortOptions={sortOptions}
          onSortChange={onSortChange}
          onSearch={onSearch}
          searchValue={currentSearch}
          searchPlaceholder="Search lawyers by name, specialization, or location..."
        />
      )}

      {(currentFilter === 'specialization' || currentFilter === 'location' || currentFilter === 'isAvailable') && (
        <FilterSection
          currentFilter={currentFilter}
          currentSpecialization={currentSpecialization}
          currentLocation={currentLocation}
          currentAvailable={currentAvailable}
          onFilterChange={onFilterChange}
          onSpecializationChange={onSpecializationChange}
          onLocationChange={onLocationChange}
          onAvailableChange={onAvailableChange}
          onClose={() => onFilterChange('all')}
          showFilterBadge={true}
        />
      )}

      {lawyers.length === 0 ? (
        <EmptyState
          label="No Lawyers Found"
          title="No Lawyers Match Your Search"
          description={
            currentSearch || currentFilter !== "all" 
              ? `No lawyers found matching your search criteria. Try adjusting your filters or search term.`
              : "No lawyers are available at the moment. Please check back later."
          }
          actions={[
            {
              label: "Clear Filters",
              onClick: () => {
                onFilterChange('all');
                onSearch('');
              },
              variant: "outline",
            }
          ]}
          showDefaultActions={true}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
