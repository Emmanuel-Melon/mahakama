import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mah/ui/components/select";
import type { Lawyer } from "@mah/api/clients/lawyers.api";

interface FilterSelectorProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterSelector({
  currentFilter,
  onFilterChange,
}: FilterSelectorProps) {
  return (
    <div className="flex-shrink-0">
      <div className="text-sm text-gray-600 mb-2">Filter by:</div>
      <Select value={currentFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="specialization">By Specialization</SelectItem>
          <SelectItem value="location">By Location</SelectItem>
          <SelectItem value="isAvailable">By Availability</SelectItem>
          <SelectItem value="all">Clear Filter</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
