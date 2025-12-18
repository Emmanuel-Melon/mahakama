import { useState, useEffect } from "react";
import { ServiceCard } from "./service-card";
import { ListControls } from "~/components/list-controls";
import { LoadingState } from "~/components/async-state/loading";
import { EmptyState } from "~/components/async-state/empty";
import type { components } from "~/lib/api/generated/api.types";

export type LegalService = components["schemas"]["LegalService"];
export type LegalServiceResource = components["schemas"]["LegalServiceResource"];
export type LegalServiceSingleResponse = components["schemas"]["LegalServiceSingleResponse"];
export type LegalServicesCollectionResponse = components["schemas"]["LegalServicesCollectionResponse"];
export type CategoryLabels = components["schemas"]["CategoryLabels"];
export type ServiceCategory = components["schemas"]["ServiceCategory"];

interface ServicesListProps {
  services: LegalService[];
  displayMode?: "list" | "grid";
  variant?: "default" | "minimal";
  showControls?: boolean;
  isLoading?: boolean;
}

export function ServicesList({
  services = [],
  displayMode: externalDisplayMode = "grid",
  variant = "default",
  showControls = true,
  isLoading = false,
}: ServicesListProps) {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">(
    externalDisplayMode
  );

  useEffect(() => {
    setDisplayMode(externalDisplayMode);
  }, [externalDisplayMode]);

  if (isLoading) {
    return (
      <LoadingState
        label="Loading Services"
        title="Loading Legal Services"
        description="Please wait while we load the available legal services..."
        className="mt-8"
      />
    );
  }

  if (services.length === 0) {
    return (
      <EmptyState
        label="No Services"
        title="No Legal Services Found"
        description="No legal services match your search criteria. Try adjusting your filters or search for different services."
        className="mt-8"
        actions={[
          {
            label: "Browse All Categories",
            href: "/legal-hub",
            variant: "outline",
          },
        ]}
        showDefaultActions={true}
      />
    );
  }

  return (
    <div className="space-y-6">
      {showControls && (
        <ListControls
          totalItems={services.length}
          itemName="service"
          displayMode={displayMode}
          onDisplayModeChange={setDisplayMode}
        />
      )}

      {displayMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="h-full">
              <ServiceCard
                service={service}
                variant={variant}
                displayMode="grid"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              variant={variant}
              displayMode="list"
            />
          ))}
        </div>
      )}
    </div>
  );
}
