import { useState, useMemo } from "react";
import { Building2, Scale, HeartHandshake, Shield, Search, MapPin, X } from "lucide-react";
import { HeroSection } from "~/layouts/HeroSection";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { ServicesList } from "~/feature/website/components/legal-hub/services-list";
import type { LegalService as ApiLegalService } from "~/feature/website/hooks/use-services";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { components } from "~/lib/api/generated/api.types";
import { useServices } from "~/feature/website/hooks/use-services";

export type LegalService = components["schemas"]["LegalService"];
export type LegalServiceResource = components["schemas"]["LegalServiceResource"];
export type LegalServiceSingleResponse = components["schemas"]["LegalServiceSingleResponse"];
export type LegalServicesCollectionResponse = components["schemas"]["LegalServicesCollectionResponse"];
export type CategoryLabels = components["schemas"]["CategoryLabels"];
export type ServiceCategory = components["schemas"]["ServiceCategory"];

interface LegalHubScreenProps {
  services?: ApiLegalService[];
  token?: string | null;
  error?: string | null;
}

const categoryIcons = {
  government: Building2,
  'legal-aid': Scale,
  'dispute-resolution': HeartHandshake,
  'specialized': Shield
} as const;

const categoryLabels = {
  government: 'Government',
  'legal-aid': 'Legal Aid',
  'dispute-resolution': 'Dispute Resolution',
  'specialized': 'Specialized'
} as const;


export const LegalHubScreen: React.FC<LegalHubScreenProps> = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data: services, error: servicesError } = useServices(undefined, token || undefined);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || locationFilter !== '';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setLocationFilter('');
  };

  return (
    <div className="min-h-screen">
      <div className="bg-background">
        <HeroSection
          title="Legal Services Directory"
          description="Connect with government offices, legal aid providers, and dispute resolution services in South Sudan and Uganda."
          actionVariant="search"
          onSearch={(query: string) => setSearchTerm(query)}
          searchPlaceholder="Search for services, institutions, or locations..."
          icon={Building2}
        />
        <DiagonalSeparator />
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <span>Filters {hasActiveFilters && `(${services?.length} results)`}</span>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Services List */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {services?.length} {services?.length === 1 ? 'Service' : 'Services'}
                {hasActiveFilters && (
                  <span className="text-lg font-normal text-gray-500 ml-2">
                    (filtered from {services?.length})
                  </span>
                )}
              </h2>
              <div className="hidden md:block">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
            <ServicesList
              services={services ?? []}
              variant="default"
              showControls={true}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
