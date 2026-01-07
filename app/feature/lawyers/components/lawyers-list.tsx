import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDebouncedValue } from "~/hooks/use-debounce";
import { LawyerCard } from "./lawyer-card";
import { ListControls } from "~/components/list-controls";
import { FilterSection } from "./filter-section";
import type { Lawyer } from "~/lib/api/lawyers.api";
import { Users, MapPin, CheckCircle } from "lucide-react";

import { List, AutoSizer, CellMeasurer, CellMeasurerCache, Grid, Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css';

interface LawyersListProps {
  lawyers: Lawyer[];
  displayMode: "list" | "grid";
  onDisplayModeChange: (mode: "list" | "grid") => void;
  variant?: "default" | "minimal";
  showControls?: boolean;
}

export function LawyersList({
  lawyers = [],
  displayMode,
  onDisplayModeChange,
  variant = "default",
  showControls = true,
}: LawyersListProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFilter = searchParams.get('filter') || "all";
  const currentSort = searchParams.get('sort') || 'createdAt';
  const currentSearch = searchParams.get('q') || '';
  const currentSpecialization = searchParams.get('specialization') || '';
  const currentLocation = searchParams.get('location') || '';
  const currentAvailable = searchParams.get('available') || '';

  const debouncedSearch = useDebouncedValue(currentSearch, 400);

  const sortLawyers = (lawyersToSort: Lawyer[], sortValue: string) => {
    const sortOrder = sortValue.startsWith('-') ? 'desc' : 'asc';
    const sortField = sortValue.startsWith('-') ? sortValue.substring(1) : sortValue;

    return [...lawyersToSort].sort((a, b) => {
      let aValue: any = a[sortField as keyof Lawyer];
      let bValue: any = b[sortField as keyof Lawyer];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  const sortedLawyers = sortLawyers(lawyers, currentSort);

  const handleFilterChange = (filterValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('specialization');
    newParams.delete('location');
    newParams.delete('available');
    newParams.delete('filter');
    
    if (filterValue !== 'all') {
      newParams.set('filter', filterValue);
    }
    
    setSearchParams(newParams);
  };

  const handleSpecializationChange = (specialization: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('specialization');
    if (specialization) {
      newParams.set('specialization', specialization);
      newParams.set('filter', 'specialization');
    }
    setSearchParams(newParams);
  };

  const handleLocationChange = (location: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('location');
    if (location) {
      newParams.set('location', location);
      newParams.set('filter', 'location');
    }
    setSearchParams(newParams);
  };

  const handleAvailableChange = (available: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('available');
    if (available === 'true' || available === 'false') {
      newParams.set('available', available);
      newParams.set('filter', 'isAvailable');
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (searchValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    if (searchValue.trim()) {
      newParams.set('q', searchValue.trim());
    }
    setSearchParams(newParams);
  };

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      handleSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, currentSearch]);

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('sort');
    const sortValue = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
    newParams.set('sort', sortValue);
    setSearchParams(newParams);
  };

  const filterOptions = [
    { value: "all", label: "All Lawyers", icon: Users },
    { value: "specialization", label: "By Specialization", icon: Users },
    { value: "location", label: "By Location", icon: MapPin },
    { value: "isAvailable", label: "Available Now", icon: CheckCircle },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Most Recent" },
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
  ];

  const currentSortOrder = currentSort.startsWith('-') ? 'desc' : 'asc';
  const currentSortField = currentSort.startsWith('-') ? currentSort.substring(1) : currentSort;

  return (
    <div className="space-y-6">
      {showControls && (
        <ListControls
          totalItems={sortedLawyers.length}
          itemName="lawyer"
          label="Lawyers"
          displayMode={displayMode}
          onDisplayModeChange={onDisplayModeChange}
          filterBy={currentFilter}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          sortBy={currentSortField}
          sortOrder={currentSortOrder}
          sortOptions={sortOptions}
          onSortChange={handleSortChange}
          onSearch={handleSearchChange}
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
          onFilterChange={handleFilterChange}
          onSpecializationChange={handleSpecializationChange}
          onLocationChange={handleLocationChange}
          onAvailableChange={handleAvailableChange}
          onClose={() => handleFilterChange('all')}
          showFilterBadge={true}
        />
      )}

      {displayMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedLawyers.map((lawyer) => (
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
          {sortedLawyers.map((lawyer) => (
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
