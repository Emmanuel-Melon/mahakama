import {
  Filter,
  ArrowDownUp,
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "app/components/ui/button";
import { BorderedBox } from "app/components/ui/bordered-box";
import { ButtonGroup } from "app/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "app/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app/components/ui/select";
import { useState, useEffect } from "react";

type ViewMode = "list" | "grid";
type SortOrder = "asc" | "desc";

interface SortOption {
  value: string;
  label: string;
}

interface ListControlsProps {
  totalItems: number;
  onViewModeChange?: (mode: ViewMode) => void;
  displayMode?: ViewMode;
  onDisplayModeChange?: (mode: ViewMode) => void;
  label?: string;
  itemName?: string;
  className?: string;

  // Pagination props
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  // Sorting props
  sortBy?: string;
  sortOrder?: SortOrder;
  sortOptions?: SortOption[];
  onSortChange?: (sortBy: string, sortOrder: SortOrder) => void;

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

  // Pagination
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,

  // Sorting
  sortBy = "createdAt",
  sortOrder = "desc",
  sortOptions = DEFAULT_SORT_OPTIONS,
  onSortChange,

  // Loading state
  isLoading = false,
}: ListControlsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(externalDisplayMode);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localSortOrder, setLocalSortOrder] = useState<SortOrder>(sortOrder);

  useEffect(() => {
    if (externalDisplayMode !== viewMode) {
      setViewMode(externalDisplayMode);
    }
  }, [externalDisplayMode, viewMode]);

  const handleSortChange = (value: string) => {
    const newSortBy = value.startsWith("-") ? value.substring(1) : value;
    const newSortOrder: SortOrder = value.startsWith("-") ? "desc" : "asc";

    setLocalSortBy(newSortBy);
    setLocalSortOrder(newSortOrder);
    onSortChange?.(newSortBy, newSortOrder);
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    onPageSizeChange?.(newSize);
  };

  const goToFirstPage = () => onPageChange?.(1);
  const goToPreviousPage = () =>
    currentPage > 1 && onPageChange?.(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && onPageChange?.(currentPage + 1);
  const goToLastPage = () => onPageChange?.(totalPages);

  const currentSortValue = `${localSortOrder === "desc" && localSortBy !== "createdAt" ? "-" : ""}${localSortBy}`;

  return (
    <div className={`space-y-4 ${className}`}>
      <BorderedBox className="px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{totalItems}</span> {itemName}
            {totalItems !== 1 ? "s" : ""} found
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  Sort by:
                </span>
                <Select
                  value={currentSortValue}
                  onValueChange={handleSortChange}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className="w-[180px] border-2 border-gray-900 bg-white hover:bg-yellow-50"
                    style={{
                      boxShadow: "2px 2px 0 0 #000",
                      borderRadius: "4px 8px 4px 8px",
                    }}
                  >
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent
                    className="border-2 border-gray-900 bg-white"
                    style={{ boxShadow: "3px 3px 0 0 #000" }}
                  >
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              <ButtonGroup>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className={`border-2 border-gray-900 ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white hover:bg-yellow-50"}`}
                  style={{
                    boxShadow: "2px 2px 0 0 #000",
                    borderRadius: "4px 0 0 4px",
                  }}
                  onClick={() => {
                    const newMode = "grid";
                    setViewMode(newMode);
                    onViewModeChange?.(newMode);
                    onDisplayModeChange?.(newMode);
                  }}
                  disabled={isLoading}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className={`border-2 border-l-0 border-gray-900 ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white hover:bg-yellow-50"}`}
                  style={{
                    boxShadow: "2px 2px 0 0 #000",
                    borderRadius: "0 4px 4px 0",
                  }}
                  onClick={() => {
                    const newMode = "list";
                    setViewMode(newMode);
                    onViewModeChange?.(newMode);
                    onDisplayModeChange?.(newMode);
                  }}
                  disabled={isLoading}
                >
                  <List className="h-4 w-4" />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </BorderedBox>

      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger
              className="w-[80px] border-2 border-gray-900 bg-white hover:bg-yellow-50"
              style={{
                boxShadow: "2px 2px 0 0 #000",
                borderRadius: "4px 8px 4px 8px",
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className="border-2 border-gray-900 bg-white"
              style={{ boxShadow: "3px 3px 0 0 #000" }}
            >
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">per page</span>
        </div>

        {/* Pagination Controls - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-gray-900 bg-white hover:bg-yellow-50"
            style={{
              boxShadow: "2px 2px 0 0 #000",
              borderRadius: "4px 8px 4px 8px",
            }}
            onClick={goToFirstPage}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-gray-900 bg-white hover:bg-yellow-50"
            style={{
              boxShadow: "2px 2px 0 0 #000",
              borderRadius: "4px 8px 4px 8px",
            }}
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span
            className="text-sm text-gray-700 px-3 py-1 border-2 border-gray-900 bg-white"
            style={{
              boxShadow: "2px 2px 0 0 #000",
              borderRadius: "4px 8px 4px 8px",
            }}
          >
            {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-gray-900 bg-white hover:bg-yellow-50"
            style={{
              boxShadow: "2px 2px 0 0 #000",
              borderRadius: "4px 8px 4px 8px",
            }}
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-gray-900 bg-white hover:bg-yellow-50"
            style={{
              boxShadow: "2px 2px 0 0 #000",
              borderRadius: "4px 8px 4px 8px",
            }}
            onClick={goToLastPage}
            disabled={currentPage >= totalPages || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
