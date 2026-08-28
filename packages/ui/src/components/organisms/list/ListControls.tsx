import { Card } from "../../Card";
import { useState, useEffect } from "react";
import { SearchBar } from "../../molecules/SearchBar";
import { SortSelect } from "../../molecules/SortSelect";
import { ViewModeToggle } from "../../molecules/ViewModeToggle";
import { FilterSelect } from "../../molecules/FilterSelect";

type ViewMode = "list" | "grid";
type SortOrder = "asc" | "desc";

interface SortOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ListControlsProps {
  totalItems: number;
  onViewModeChange?: (mode: ViewMode) => void;
  displayMode?: ViewMode;
  onDisplayModeChange?: (mode: ViewMode) => void;
  label?: string;
  itemName?: string;
  className?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;

  // Sorting props
  sortBy?: string;
  sortOrder?: SortOrder;
  sortOptions?: SortOption[];
  onSortChange?: (sortBy: string, sortOrder: SortOrder) => void;

  // Filtering props
  filterBy?: string;
  filterOptions?: SortOption[];
  onFilterChange?: (filterBy: string) => void;

  // Loading state
  isLoading?: boolean;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: "createdAt", label: "Most Recent" },
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
];

export function ListControls({
  totalItems,
  onViewModeChange,
  onDisplayModeChange,
  displayMode: externalDisplayMode = "list",
  label = "Section",
  itemName = "item",
  className = "",
  onSearch,
  searchPlaceholder = "Search...",
  searchValue = "",

  // Sorting
  sortBy = "createdAt",
  sortOrder = "desc",
  sortOptions = DEFAULT_SORT_OPTIONS,
  onSortChange,

  // Filtering
  filterBy,
  filterOptions = [],
  onFilterChange,

  // Loading state
  isLoading = false,
}: ListControlsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(externalDisplayMode);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localSortOrder, setLocalSortOrder] = useState<SortOrder>(sortOrder);
  const [localFilterBy, setLocalFilterBy] = useState(filterBy || "");
  const [searchQuery, setSearchQuery] = useState(searchValue || "");

  useEffect(() => {
    if (externalDisplayMode !== viewMode) {
      setViewMode(externalDisplayMode);
    }
  }, [externalDisplayMode, viewMode]);

  useEffect(() => {
    if (searchValue !== searchQuery) {
      setSearchQuery(searchValue);
    }
  }, [searchValue, setSearchQuery]);

  const handleSortChange = (value: string) => {
    const newSortBy = value.startsWith("-") ? value.substring(1) : value;
    const newSortOrder: SortOrder = value.startsWith("-") ? "desc" : "asc";

    setLocalSortBy(newSortBy);
    setLocalSortOrder(newSortOrder);
    onSortChange?.(newSortBy, newSortOrder);
  };

  const handleFilterChange = (value: string) => {
    setLocalFilterBy(value);
    onFilterChange?.(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const currentSortValue = `${localSortOrder === "desc" && localSortBy !== "createdAt" ? "-" : ""}${localSortBy}`;

  // Create dynamic label with count if both are provided
  const dynamicLabel =
    label && totalItems !== undefined ? `${totalItems} ${label}` : label;

  return (
    <div className={`space-y-4 w-full ${className}`}>
      <Card className="px-4 py-3 border-solid border-gray-150 rounded-[8px_16px_8px_16px] max-w-none mx-0">
        {dynamicLabel && (
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-3">
            {dynamicLabel}
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 w-full sm:w-96">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              {filterOptions.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 hidden sm:inline">
                      Filter by:
                    </span>
                    <FilterSelect
                      value={localFilterBy}
                      onValueChange={handleFilterChange}
                      options={filterOptions}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="h-6 w-px bg-gray-300 mx-2"></div>
                </>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  Sort by:
                </span>
                <SortSelect
                  value={currentSortValue}
                  onValueChange={handleSortChange}
                  options={sortOptions}
                  disabled={isLoading}
                />
              </div>

              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              <ViewModeToggle
                currentMode={viewMode}
                onModeChange={(newMode) => {
                  setViewMode(newMode);
                  onViewModeChange?.(newMode);
                  onDisplayModeChange?.(newMode);
                }}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
