import { useState } from "react";
import { Building2, Scale, HeartHandshake, Shield, Search } from "lucide-react";
import { HeroSection } from "@mah/ui";
import { DiagonalSeparator } from "@mah/ui/components/atoms/DiagnoalSeparator";
import { ServicesList } from "~/feature/www/components/legal-hub/services-list";
import type {
  LegalService as ApiLegalService,
  ServiceCategory,
} from "@mah/api/src/clients/services.api";
import { Button } from "@mah/ui/components/Button";
import { AsyncContainer } from "@mah/ui";
import type { AsyncState } from "@mah/api/src/api/api.types";

interface LegalHubScreenProps extends AsyncState {
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
  isLoading,
  error,
  isAuthenticated,
  displayMode = "grid",
  onDisplayModeChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters = searchTerm !== "" || locationFilter !== "";

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
      <div className="p-6 max-w-7xl mx-auto">
        <AsyncContainer
          data={services}
          isLoading={isLoading}
          error={error}
          loadingComponent={
            <div className="text-center py-12 text-muted-foreground">
              Loading legal services...
            </div>
          }
          emptyState={{
            icon: Building2,
            badge: "Directory",
            title: "No Services Found",
            description:
              "We couldn't find any legal services matching your criteria right now.",
          }}
        >
          {services && (
            <div>
              {/* Mobile Filter Toggle */}
              <div className="md:hidden mb-6">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                  <span>
                    Filters{" "}
                    {hasActiveFilters && `(${services?.length} results)`}
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
          )}
        </AsyncContainer>
      </div>
    </>
  );
};
