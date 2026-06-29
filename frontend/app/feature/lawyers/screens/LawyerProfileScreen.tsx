import { PageHeader } from "~/layouts/PageHeader";
import { PageDetailHeader } from "~/layouts/page-detail-header";
import { ErrorState } from "~/components/async-state/error";
import { EmptyState } from "~/components/async-state/empty";
import { PageDetailsLoading } from "~/components/page-details-loading";
import { PageDetailsError } from "~/components/page-details-error";
import { LawyerBio } from "~/feature/lawyers/components/lawyer-bio";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { BorderedBox } from "~/components/ui/bordered-box";
import { EducationSection } from "~/feature/lawyers/components/LawyerEducation";
import {
  ContactInformation,
  type ContactItem,
} from "~/components/contact-information";
import { Scale, MapPin, Briefcase, Home, Users } from "lucide-react";

import type { components } from "~/lib/api/generated/api.types";
import type { components as componentsv1 } from "~/lib/api/generated/api.types";

export type AuthResponse = componentsv1["schemas"]["AuthResponse"];
export type JsonApiErrorResponse =
  componentsv1["schemas"]["JsonApiErrorResponse"];
export type Lawyer = components["schemas"]["Lawyer"];

type LawyerProfileScreenProps = {
  error: any;
  lawyer?: Lawyer;
  isLoading?: boolean;
};

export const LawyerProfileScreen = ({
  error,
  lawyer,
  isLoading,
}: LawyerProfileScreenProps) => {
  if (isLoading) {
    return (
      <PageDetailsLoading
        title="Loading Lawyer Profile"
        description="Please wait while we load the lawyer's information..."
        skeletonCount={2}
      />
    );
  }

  if (error) {
    return (
      <PageDetailsError
        error={error}
        title="Error Loading Lawyer Profile"
        description="We couldn't load the lawyer profile. Please check your connection and try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!lawyer) {
    return (
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
    );
  }

  const handleContact = () => {
    // TODO: Implement contact functionality
  };

  const getExperienceText = (years?: number) => {
    if (!years) return "No experience info";
    if (years === 1) return "1 year";
    return `${years} years`;
  };

  const metadata = [];

  if (lawyer.specialization) {
    metadata.push({
      icon: Scale,
      label: "Specialization",
      value: lawyer.specialization,
    });
  }

  if (lawyer.experienceYears) {
    metadata.push({
      icon: Briefcase,
      label: "Experience",
      value: getExperienceText(lawyer.experienceYears),
    });
  }

  if (lawyer.location) {
    metadata.push({
      icon: MapPin,
      label: "Location",
      value: lawyer.location,
    });
  }

  const actions = [];

  if (handleContact) {
    actions.push({
      label: "Contact Lawyer",
      icon: MapPin,
      onClick: handleContact,
      variant: "primary" as const,
    });
  }

  const breadcrumbs = [
    { label: "Home", to: "/", icon: Home },
    { label: "Lawyers", to: "/lawyers", icon: Users },
    { label: lawyer.name || "Lawyer Profile", to: `/lawyers/${lawyer.id}` },
  ];

  const contactItems: ContactItem[] = [];

  if (lawyer.email) {
    contactItems.push({
      type: "email",
      label: "Email Address",
      value: lawyer.email,
    });
  }

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} className="hidden sm:flex" />
      <PageDetailHeader
        type="Lawyer Profile"
        title={lawyer.name || "Lawyer Profile"}
        description={lawyer.specialization || "Legal Professional"}
        image="https://picsum.photos/seed/lawyer-avatar/200/200.jpg"
        alt={`${lawyer.name} profile picture`}
        metadata={metadata}
        actions={actions}
      />

      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <LawyerBio
                bio="No bio available for this lawyer."
                className="h-full"
              />
              <EducationSection />
            </div>
          </div>
          <ContactInformation
            title=""
            description=""
            contactItems={contactItems}
          />
        </div>
      </div>
    </>
  );
};
