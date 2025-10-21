import type {
  MetaArgs,
  LoaderArgs,
  ComponentProps,
  LoaderData,
} from "./+types/lawyer.profile";
import { PageLayout, PageHeader } from "~/components/layouts/page-layout";
import { ErrorDisplay } from "~/components/async-state/error";
import { EmptyState } from "~/components/async-state/empty";
import { LawyerProfileHeader } from "~/lawyers/lawyer-profile-header";
import { LawyerBio } from "~/lawyers/lawyer-bio";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { BorderedBox } from "~/components/ui/bordered-box";
import { Button } from "~/components/ui/button";
import { CardWithLabel } from "~/components/ui/card-with-label";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  GraduationCap,
} from "lucide-react";
import { StylizedList } from "~/components/ui/stylized-list";
import { API_CONFIG } from "~/config";

export function meta({ loaderData }: MetaArgs) {
  const { lawyer } = loaderData;
  const title = lawyer
    ? `${lawyer.name}'s Profile - Mahakama`
    : "Lawyer Profile - Mahakama";

  return [
    { title },
    {
      name: "description",
      content: `View the profile of ${lawyer?.name || "our legal expert"}. Contact for professional legal services.`,
    },
  ];
}

export async function loader({ params }: LoaderArgs): Promise<LoaderData> {
  try {
    const { lawyerId } = params;
    if (!lawyerId) {
      throw new Error("Lawyer ID is required");
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/lawyers/${lawyerId}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch lawyer data: ${response.status} ${response.statusText}`,
      );
    }

    const lawyer = await response.json();

    // Ensure we have the basic required fields
    if (!lawyer || !lawyer.id || !lawyer.name) {
      throw new Error("Invalid lawyer data received from the server");
    }

    // Convert rating to number if it's a string
    if (typeof lawyer.rating === "string") {
      lawyer.rating = parseFloat(lawyer.rating) || 0;
    }

    return { lawyer };
  } catch (error) {
    console.error("Error loading lawyer profile:", error);
    return {
      lawyer: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load lawyer profile",
    };
  }
}

function EducationSection() {
  const educationItems = [
    "LLM in International Human Rights Law - University of London (2015)",
    "LLB (Hons) - University of Nairobi (2011)",
    "Certificate in Criminal Justice - The Hague Academy (2013)",
  ];

  return (
    <CardWithLabel
      label="Education"
      labelClassName="text-xs font-mono text-gray-500"
    >
      <div className="py-2">
        <StylizedList
          items={educationItems.map((text) => ({ text }))}
          itemClassName="group"
          defaultIcon={GraduationCap}
          renderItem={(item) => (
            <span className="text-gray-800 group-hover:text-gray-900">
              {item.text}
            </span>
          )}
        />
      </div>
    </CardWithLabel>
  );
}

function StyledContactList({
  email,
  phone,
  location,
}: {
  email?: string;
  phone?: string;
  location?: string;
}) {
  return (
    <StylizedList
      items={[
        {
          text: email || "contact@example.com",
          icon: MailIcon,
          href: email ? `mailto:${email}` : undefined,
        },
        {
          text: phone || "+1 (234) 567-890",
          icon: PhoneIcon,
          href: phone ? `tel:${phone}` : undefined,
        },
        {
          text: location || "Nairobi, Kenya",
          icon: MapPinIcon,
        },
      ]}
      itemClassName="group"
      renderItem={(item) => {
        const content = (
          <span className="text-gray-800 group-hover:text-gray-900">
            {item.text}
          </span>
        );

        return item.href ? (
          <a
            href={item.href}
            className="text-blue-600 hover:underline hover:text-blue-700"
          >
            {content}
          </a>
        ) : (
          content
        );
      }}
    />
  );
}

export default function LawyerProfile({ loaderData }: ComponentProps) {
  const { lawyer, error } = loaderData;

  if (error) {
    return (
      <PageLayout className="py-8">
        <ErrorDisplay
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

  return (
    <PageLayout className="space-y-8">
      <PageHeader />
      <LawyerProfileHeader lawyer={lawyer} onContact={handleContact} />

      <div className="max-w-6xl mx-auto">
        <DiagonalSeparator className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bio */}
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

          {/* Right Column - Contact Info */}
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
                    location={lawyer.location}
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
