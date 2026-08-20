import { useState, useMemo } from "react";
import {
  Building2,
  Scale,
  HeartHandshake,
  Shield,
  Search,
  MapPin,
  X,
} from "lucide-react";
import { HeroSection } from "~/layouts/HeroSection";
import { DiagonalSeparator } from "~/components/atoms/diagnoal-separator";
import { ServicesList } from "~/feature/www/components/legal-hub/services-list";
import type { LegalService as ApiLegalService } from "@mah/api/hooks/use-services";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { components } from "@mah/api/generated/api.types";

export type LegalService = components["schemas"]["LegalService"];
export type LegalServiceResource =
  components["schemas"]["LegalServiceResource"];
export type LegalServiceSingleResponse =
  components["schemas"]["LegalServiceSingleResponse"];
export type LegalServicesCollectionResponse =
  components["schemas"]["LegalServicesCollectionResponse"];
export type CategoryLabels = components["schemas"]["CategoryLabels"];
export type ServiceCategory = components["schemas"]["ServiceCategory"];

interface LegalHubScreenProps {
  services: ApiLegalService[];
  isAuthenticated?: boolean;
  displayMode?: "grid" | "list";
  onDisplayModeChange?: (mode: "grid" | "list") => void;
}

const categoryIcons = {
  government: Building2,
  "legal-aid": Scale,
  "dispute-resolution": HeartHandshake,
  specialized: Shield,
} as const;

const categoryLabels = {
  government: "Government",
  "legal-aid": "Legal Aid",
  "dispute-resolution": "Dispute Resolution",
  specialized: "Specialized",
} as const;

export const LegalHubScreen: React.FC<LegalHubScreenProps> = ({
  services,
  isAuthenticated,
  displayMode = "grid",
  onDisplayModeChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory>("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters =
    searchTerm !== "" || selectedCategory !== "all" || locationFilter !== "";

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setLocationFilter("");
  };

  return (
    <>
      {!isAuthenticated && (
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
      )}
      <div>
        {/* Mobile Filter Toggle */}
        <div className="md:hidden">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <span>
              Filters {hasActiveFilters && `(${services?.length} results)`}
            </span>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <ServicesList
          services={services}
          variant="default"
          showControls={true}
          isLoading={false}
          displayMode={displayMode}
          onDisplayModeChange={onDisplayModeChange}
        />
      </div>
    </>
  );
};
