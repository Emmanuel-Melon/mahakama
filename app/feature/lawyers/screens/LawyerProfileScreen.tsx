import { PageLayout, PageHeader } from "~/layouts/page-layout";
import { ErrorState } from "~/components/async-state/error";
import { EmptyState } from "~/components/async-state/empty";
import { LawyerProfileHeader } from "~/feature/lawyers/components/lawyer-profile-header";
import { LawyerBio } from "~/feature/lawyers/components/lawyer-bio";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { BorderedBox } from "~/components/ui/bordered-box";
import { EducationSection, StyledContactList } from "~/feature/lawyers/components/LawyerEducation";

import type { components } from "~/lib/api/generated/api.types";
import type { components as componentsv1} from "~/lib/api/generated/api1.types";
import { MapPin } from "lucide-react";

export type AuthResponse = componentsv1["schemas"]["AuthResponse"];
export type JsonApiErrorResponse = componentsv1["schemas"]["JsonApiErrorResponse"];
export type Lawyer = components["schemas"]["Lawyer"];

type LawyerProfileScreenProps = {
  error: any;
  lawyer: Lawyer;
};

export const LawyerProfileScreen = ({ error, lawyer }: LawyerProfileScreenProps) => {

  if (error) {
    return (
      <PageLayout className="py-8">
        <ErrorState
          error={error}
          title="Error Loading Profile"
          className="max-w-3xl mx-auto"
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
          className="max-w-3xl mx-auto"
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
      <PageHeader breadcrumbs={breadcrumbs} />
      <LawyerProfileHeader lawyer={lawyer} onContact={handleContact} />

      <div className="max-w-6xl mx-auto">
        <DiagonalSeparator className="mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BorderedBox variant="decorated" label="Lawyer Profile">
              <div className="space-y-6">
                <LawyerBio
                  bio={lawyer.bio || "No bio available for this lawyer."}
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
                    phone={lawyer.phone}
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
