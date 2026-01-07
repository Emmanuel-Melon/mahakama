import type { FC } from "react";
import { useState } from "react";
import { LawyersList } from "~/feature/lawyers/components/lawyers-list";
import { HeroSection } from "~/layouts/HeroSection";
import { Gavel } from "lucide-react";
import { ErrorState } from "~/components/async-state/error";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { PageLayout } from "~/layouts/page-layout";

import type { components as componentsv1 } from "~/lib/api/generated/api.types";
export type Lawyer = componentsv1["schemas"]["Lawyer"];

type LawyersScreenProps = {
  lawyers: Lawyer[];
  error: any;
  isLoading?: boolean;
  isAuthenticated?: boolean;
};

export const LawyersScreen: FC<LawyersScreenProps> = ({ lawyers, error, isLoading, isAuthenticated }) => {
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("grid");

  return (
    <PageLayout>
      {!isAuthenticated && (
        <div className="bg-background">
          <HeroSection
            title="Find Trusted Legal Professionals"
            description="Connect with vetted lawyers and legal experts in various fields of law. Get the right legal assistance for your specific needs."
            actionVariant="search"
            icon={Gavel}
          />
          <DiagonalSeparator />
        </div>
      )}
      <div>
        <div>
          {error ? (
            <ErrorState error={error} />
          ) : (
            <LawyersList 
              lawyers={lawyers} 
              displayMode={displayMode}
              onDisplayModeChange={setDisplayMode}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
