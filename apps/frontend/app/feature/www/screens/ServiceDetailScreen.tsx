import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Users,
  FileText,
  Building,
  Home,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { PageHeader } from "@mah/ui";
import { PageDetailHeader } from "@mah/ui";
import { ContactInformation, type ContactItem } from "@mah/ui";
import type { LegalService } from "@mah/api/src/clients/services.api";

interface ServiceDetailScreenProps {
  service: LegalService;
  onBack?: () => void;
}

export function ServiceDetailScreen({
  service,
  onBack,
}: ServiceDetailScreenProps) {
  const contactItems: ContactItem[] = [];

  if (service.contact) {
    contactItems.push({
      type: "phone",
      label: "Phone",
      value: service.contact,
    });
  }

  if (service.location) {
    contactItems.push({
      type: "location",
      label: "Location",
      value: service.location,
    });
  }

  if (service.website) {
    contactItems.push({
      type: "website",
      label: "Website",
      value: "Visit Website",
      href: service.website,
    });
  }

  const metadata = [];

  if (service.category) {
    metadata.push({
      icon: Building,
      label: "Category",
      value: service.category,
    });
  }

  const actions = [];

  if (onBack) {
    actions.push({
      label: "Back",
      icon: ArrowLeft,
      onClick: onBack,
      variant: "outline" as const,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        showBackButton={!!onBack}
        breadcrumbs={[
          { label: "Home", to: "/", icon: Home },
          { label: "Services", to: "/services", icon: Building },
          { label: service.name },
        ]}
      />

      <PageDetailHeader
        type="Service Detail"
        title={service.name}
        description={service.description}
        icon={Building}
        metadata={metadata}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {service.services &&
            Array.isArray(service.services) &&
            service.services.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Services Offered
                </h2>
                <ul className="space-y-2">
                  {service.services.map((serviceItem, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">
                        {typeof serviceItem === "string"
                          ? serviceItem
                          : typeof serviceItem === "object" &&
                              serviceItem !== null
                            ? JSON.stringify(serviceItem)
                            : String(serviceItem)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    Service Availability
                  </p>
                  <p className="text-gray-600">Contact for operating hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Service Type</p>
                  <p className="text-gray-600 capitalize">
                    {service.category?.replace("-", " ") ||
                      "General Legal Service"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {contactItems.length > 0 && (
            <ContactInformation
              title="Contact Information"
              description="Get in touch with this service provider."
              contactItems={contactItems}
            />
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Get Help
            </h2>
            <div className="space-y-3">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-gray-900">
                Contact Service Provider
              </Button>
              <Button variant="outline" className="w-full">
                Ask a Legal Question
              </Button>
              <Button variant="outline" className="w-full">
                Find Similar Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
