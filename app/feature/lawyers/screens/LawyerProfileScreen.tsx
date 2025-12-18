import { PageLayout, PageHeader } from "~/layouts/page-layout";
import { ErrorState } from "~/components/async-state/error";
import { EmptyState } from "~/components/async-state/empty";
import { LawyerProfileHeader } from "~/feature/lawyers/components/lawyer-profile-header";
import { LawyerBio } from "~/feature/lawyers/components/lawyer-bio";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { BorderedBox } from "~/components/ui/bordered-box";
import { EducationSection, StyledContactList } from "~/feature/lawyers/components/LawyerEducation";

import type { components } from "~/lib/api/generated/api.types";
import type { components as componentsv1} from "~/lib/api/generated/api.types";
import { MapPin } from "lucide-react";

export type AuthResponse = componentsv1["schemas"]["AuthResponse"];
export type JsonApiErrorResponse = componentsv1["schemas"]["JsonApiErrorResponse"];
export type Lawyer = components["schemas"]["Lawyer"];

type LawyerProfileScreenProps = {
  error: any;
  lawyer?: Lawyer;
  isLoading?: boolean;
};

export const LawyerProfileScreen = ({ error, lawyer, isLoading }: LawyerProfileScreenProps) => {

  if (isLoading) {
    return (
      <PageLayout className="py-8">
        <div className="mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout className="py-8">
        <ErrorState
          error={error}
          title="Error Loading Profile"
          className="mx-auto"
        />
      </PageLayout>
    );
  }

  if (!lawyer) {
    return (
      <PageLayout className="py-8">
        <EmptyState
          title="Profile Not Found"
          description="We couldn't find the lawyer profile you're looking for."
          className="mx-auto"
          actions={[
            {
              label: "Back to Lawyers",
              href: "/lawyers",
              icon: <MapPin className="w-4 h-4 mr-2" />,
              variant: "default",
            },
          ]}
        />
      </PageLayout>
    );
  }

  const handleContact = () => {
    // TODO: Implement contact functionality
    console.log("Contact lawyer:", lawyer.id);
  };

  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Lawyers", to: "/lawyers" },
    { label: lawyer.name || "Lawyer Profile", to: `/lawyers/${lawyer.id}` },
  ];

  return (
    <PageLayout className="space-y-8">
      <PageHeader breadcrumbs={breadcrumbs} className="hidden sm:flex" />
      <LawyerProfileHeader lawyer={lawyer} onContact={handleContact} />

      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BorderedBox variant="decorated" label="Lawyer Profile">
              <div className="space-y-6">
                <LawyerBio
                  bio="No bio available for this lawyer."
                  className="h-full"
                />
                <EducationSection />
              </div>
            </BorderedBox>
          </div>
          <div className="lg:col-span-1 space-y-4">
            <BorderedBox
              className="h-full p-6"
              hoverEffect="lift"
              variant="decorated"
              label="Contact Information"
            >
              <div className="space-y-6">
                <div className="py-2">
                  <StyledContactList
                    email={lawyer.email}
                    phone={undefined}
                  />
                </div>
              </div>
            </BorderedBox>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
