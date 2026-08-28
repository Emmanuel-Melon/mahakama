import { FilterSelector } from "./filter-selector";
import { FilterOptions } from "./filter-options";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { Button } from "@mah/ui/components/Button";
import { Badge } from "@mah/ui/components/badge";
import { X, Filter } from "lucide-react";

interface FilterSectionProps {
  currentFilter: string;
  currentSpecialization: string;
  currentLocation: string;
  currentAvailable: string;
  onFilterChange: (filter: string) => void;
  onSpecializationChange: (specialization: string) => void;
  onLocationChange: (location: string) => void;
  onAvailableChange: (available: string) => void;
  onClose?: () => void;
  showFilterBadge?: boolean;
}

export function FilterSection({
  currentFilter,
  currentSpecialization,
  currentLocation,
  currentAvailable,
  onFilterChange,
  onSpecializationChange,
  onLocationChange,
  onAvailableChange,
  onClose,
  showFilterBadge = false,
}: FilterSectionProps) {
  // Helper function to get filter display label
  const getFilterDisplayLabel = () => {
    if (currentFilter === "specialization" && currentSpecialization) {
      return `Specialization: ${currentSpecialization.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`;
    }
    if (currentFilter === "location" && currentLocation) {
      return `Location: ${currentLocation}`;
    }
    if (currentFilter === "isAvailable" && currentAvailable) {
      return `Availability: ${currentAvailable === "true" ? "Available" : "Not Available"}`;
    }
    return null;
  };

  const currentFilterLabel = getFilterDisplayLabel();

  return (
    <CardWithLabel
      label="Filter Lawyers"
      className="px-4 py-3 border-solid border-gray-150 rounded-[8px_16px_8px_16px] max-w-none mx-0"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-6 flex-1">
          <FilterSelector
            currentFilter={currentFilter}
            onFilterChange={onFilterChange}
          />
          <FilterOptions
            currentFilter={currentFilter}
            currentSpecialization={currentSpecialization}
            currentLocation={currentLocation}
            currentAvailable={currentAvailable}
            onSpecializationChange={onSpecializationChange}
            onLocationChange={onLocationChange}
            onAvailableChange={onAvailableChange}
          />
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Badge */}
      {showFilterBadge && currentFilterLabel && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <Badge
            variant="secondary"
            className="px-3 py-1 bg-blue-100 text-blue-800 border-blue-200"
          >
            <Filter className="h-3 w-3 mr-1" />
            {currentFilterLabel}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange("all")}
              className="ml-2 h-4 w-4 p-0 hover:bg-blue-200"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </CardWithLabel>
  );
}
