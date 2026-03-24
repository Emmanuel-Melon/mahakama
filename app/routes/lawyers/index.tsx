import type { Route } from "./+types/index";
import { LawyersScreen } from "~/feature/lawyers/screens/LawyersScreen";
import { useLawyers } from "~/feature/lawyers/hooks/use-lawyers";
import { useSearchParams } from "react-router";
import { authContext, userContext } from "~/middleware/context";
import { PageLoading } from "~/components/page-loading";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "~/hooks/use-debounce";
import { Users, MapPin, CheckCircle } from "lucide-react";
import type { components as componentsv1 } from "~/lib/api/generated/api.types";
export type Lawyer = componentsv1["schemas"]["Lawyer"];
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Find Vetted Lawyers in South Sudan & Uganda - Mahakama" },
    {
      name: "description",
      content:
        "Connect with experienced, vetted legal professionals in South Sudan and Uganda. Get expert help with family law, employment rights, housing issues, and more through our trusted network.",
    },
    {
      name: "keywords",
      content:
        "find lawyer South Sudan, Uganda attorneys, legal professionals, vetted lawyers, legal consultation, family law, employment law, housing rights, legal representation",
    },
    {
      name: "og:title",
      content: "Find Trusted Legal Professionals - Mahakama",
    },
    {
      name: "og:description",
      content:
        "Connect with vetted legal experts in South Sudan and Uganda for personalized legal assistance and representation when you need it most.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Find Vetted Lawyers in East Africa" },
    {
      name: "twitter:description",
      content:
        "Mahakama connects you with trusted legal professionals in South Sudan and Uganda for expert legal advice and representation.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    return { user, token, error: null };
  } catch (error) {
    handleRouteError(error, "Failed to load user data");
  }
}

export default function LawyersPage({ loaderData }: Route.ComponentProps) {
  const { user, error } = loaderData;
  if (error) return (
    <PageLoading 
      title="Authentication Error"
      description="There was a problem loading your user session. Please try refreshing the page."
      showSkeleton={false}
    />
  );
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("grid");
  
  // Extract filter values from URL
  const currentFilter = searchParams.get('filter') || "all";
  const currentSort = searchParams.get('sort') || 'createdAt';
  const currentSearch = searchParams.get('q') || '';
  const currentSpecialization = searchParams.get('specialization') || '';
  const currentLocation = searchParams.get('location') || '';
  const currentAvailable = searchParams.get('available') || '';
  
  const debouncedSearch = useDebouncedValue(currentSearch, 400);
  
  // Prepare filters for API call
  const specialization = currentSpecialization || undefined;
  const location = currentLocation || undefined;
  const available = currentAvailable === 'true' ? true : currentAvailable === 'false' ? false : undefined;
  const q = currentSearch || undefined;
  
  const filters = {
    specialization,
    location,
    available,
    q
  };
  
  const { data: lawyers, error: lawyersError, isLoading } = useLawyers(filters);
  
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
  
  const sortedLawyers = lawyers ? sortLawyers(lawyers, currentSort) : [];
  
  // Event handlers
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
  }, [debouncedSearch]);

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
    <LawyersScreen 
      lawyers={sortedLawyers} 
      error={lawyersError} 
      isLoading={isLoading} 
      isAuthenticated={!!user}
      displayMode={displayMode}
      onDisplayModeChange={setDisplayMode}
      // Filter props
      currentFilter={currentFilter}
      currentSpecialization={currentSpecialization}
      currentLocation={currentLocation}
      currentAvailable={currentAvailable}
      currentSearch={currentSearch}
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
      onSpecializationChange={handleSpecializationChange}
      onLocationChange={handleLocationChange}
      onAvailableChange={handleAvailableChange}
      onSearch={handleSearchChange}
      // Sort props
      currentSortField={currentSortField}
      currentSortOrder={currentSortOrder}
      sortOptions={sortOptions}
      onSortChange={handleSortChange}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return (
    <MahErrorBoundary
      status={error.status}
      data={error.data}
    />
  );
}