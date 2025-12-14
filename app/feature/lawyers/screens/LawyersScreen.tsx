import type { FC } from "react";
import { LawyersList } from "~/feature/lawyers/components/lawyers-list";
import { HeroSection } from "~/layouts/HeroSection";
import { Gavel } from "lucide-react";
import { ErrorState } from "~/components/async-state/error";
import { DiagonalSeparator } from "~/components/diagnoal-separator";

import type { components } from "~/lib/api/generated/api.types";
import type { components as componentsv1} from "~/lib/api/generated/api1.types";

export type AuthResponse = componentsv1["schemas"]["AuthResponse"];
export type JsonApiErrorResponse = componentsv1["schemas"]["JsonApiErrorResponse"];
export type Lawyer = components["schemas"]["Lawyer"];

type LawyersScreenProps = {
  lawyers: Lawyer[];
  error: any;
};

export const LawyersScreen: FC<LawyersScreenProps> = ({ lawyers, error }) => {
  return (
    <div className="min-h-screen">
      <div className="bg-background">
        <HeroSection
          title="Find Trusted Legal Professionals"
          description="Connect with vetted lawyers and legal experts in various fields of law. Get the right legal assistance for your specific needs."
          actionVariant="search"
          icon={Gavel}
        />
        <DiagonalSeparator />
      </div>
      <div className="w-full bg-background/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error ? (
            <ErrorState error={error} />
          ) : (
            <LawyersList lawyers={lawyers} />
          )}
        </div>
      </div>
    </div>
  );
}
