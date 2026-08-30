import { useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader } from "@mah/ui";
import { PageDetailHeader } from "@mah/ui";
import { LawyerBio } from "~/feature/lawyers/components/lawyer-bio";
import { EducationSection } from "~/feature/lawyers/components/LawyerEducation";
import { ContactInformation, type ContactItem } from "@mah/ui";
import {
  Scale,
  MapPin,
  Briefcase,
  Home,
  Users,
  CalendarClock,
} from "lucide-react";
import { AsyncContainer } from "@mah/ui";
import { ConsultationRequestDialog } from "~/feature/consultations/components/ConsultationRequestDialog";

import type { AsyncState } from "@mah/api/src/api/api.types";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";

interface LawyerProfileScreenProps extends AsyncState {
  lawyer: Lawyer;
  isAuthenticated?: boolean;
}

export const LawyerProfileScreen = ({
  error,
  lawyer,
  isLoading,
  isAuthenticated = false,
}: LawyerProfileScreenProps) => {
  const navigate = useNavigate();
  const [requestOpen, setRequestOpen] = useState(false);
  const getExperienceText = (years?: number) => {
    if (!years) return "No experience info";
    if (years === 1) return "1 year";
    return `${years} years`;
  };

  const metadata: { icon: any; label: string; value: string }[] = lawyer
    ? []
    : [];

  if (lawyer?.specialization) {
    metadata.push({
      icon: Scale,
      label: "Specialization",
      value: lawyer.specialization,
    });
  }

  if (lawyer?.experienceYears) {
    metadata.push({
      icon: Briefcase,
      label: "Experience",
      value: getExperienceText(lawyer.experienceYears),
    });
  }

  if (lawyer?.location) {
    metadata.push({
      icon: MapPin,
      label: "Location",
      value: lawyer.location,
    });
  }

  const actions: {
    label: string;
    icon: any;
    onClick: () => void;
    variant: "primary" | "secondary";
  }[] = [];
  const handleContact = () => {
    // TODO: Implement contact functionality
  };

  if (handleContact) {
    actions.push({
      label: "Contact Lawyer",
      icon: MapPin,
      onClick: handleContact,
      variant: "primary" as const,
    });
  }

  actions.push({
    label: "Request Consultation",
    icon: CalendarClock,
    onClick: () => {
      if (isAuthenticated) {
        setRequestOpen(true);
      } else {
        navigate("/login");
      }
    },
    variant: "secondary" as const,
  });

  const breadcrumbs = [
    { label: "Home", to: "/", icon: Home },
    { label: "Lawyers", to: "/lawyers", icon: Users },
    {
      label: lawyer?.name || "Lawyer Profile",
      to: lawyer ? `/lawyers/${lawyer.id}` : "#",
    },
  ];

  const contactItems: ContactItem[] = [];

  if (lawyer?.email) {
    contactItems.push({
      type: "email",
      label: "Email Address",
      value: lawyer.email,
    });
  }

  return (
    <AsyncContainer
      data={lawyer}
      isLoading={isLoading}
      error={error}
      loadingComponent={
        <div className="text-center py-12 text-muted-foreground">
          Loading lawyer profile...
        </div>
      }
      emptyState={{
        icon: Users,
        badge: "Directory",
        title: "Profile Not Found",
        description: "We couldn't find the lawyer profile you're looking for.",
      }}
    >
      {lawyer && (
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

          <ConsultationRequestDialog
            lawyer={lawyer}
            open={requestOpen}
            onOpenChange={setRequestOpen}
          />
        </>
      )}
    </AsyncContainer>
  );
};
