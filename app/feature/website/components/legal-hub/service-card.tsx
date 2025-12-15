import { MapPin, Phone, Globe, ChevronRight, Building2, Scale, HeartHandshake, Shield } from "lucide-react";
import { NavLink } from "react-router";
import type { LegalService } from "./types";

type CardVariant = "default" | "minimal";
type DisplayMode = "grid" | "list";

interface ServiceCardProps {
  service: LegalService;
  variant?: CardVariant;
  displayMode?: DisplayMode;
}

const categoryIcons = {
  'government': Building2,
  'legal-aid': Scale,
  'dispute-resolution': HeartHandshake,
  'specialized': Shield
} as const;

const categoryLabels = {
  'government': 'Government',
  'legal-aid': 'Legal Aid',
  'dispute-resolution': 'Dispute Resolution',
  'specialized': 'Specialized'
} as const;

export function ServiceCard({
  service,
  variant = "default",
  displayMode = "list",
}: ServiceCardProps) {
  const Icon = categoryIcons[service.category as keyof typeof categoryIcons];
  const categoryLabel = categoryLabels[service.category as keyof typeof categoryLabels];

  const cardClasses: Record<DisplayMode, string> = {
    grid: "h-full border-2 border-gray-900 bg-white rounded-lg overflow-hidden hover:shadow-[4px_4px_0_0_#000] transition-all duration-200 p-5",
    list: "relative bg-white border-2 border-gray-900 rounded-lg p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]",
  };

  return (
    <div
      className={`${cardClasses[displayMode]} ${displayMode === "grid" ? "flex flex-col" : ""} group`}
      style={{
        borderRadius: "8px 16px 8px 16px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center border-2 border-gray-900">
                <Icon className="h-6 w-6 text-primary-700" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900 font-serif">
                {service.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200">
                  {categoryLabel}
                </span>
              </div>
              {service.location && (
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{service.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

        {service.services.length > 0 && (
          <div className="mt-2 mb-4 flex flex-wrap gap-2">
            {service.services.slice(0, 3).map((s, i) => (
              <span 
                key={i}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
              >
                {s}
              </span>
            ))}
            {service.services.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                +{service.services.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              {service.website && (
                <a
                  href={service.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  <Globe className="h-4 w-4 mr-1.5" />
                  Website
                </a>
              )}
              <a
                href={`tel:${service.contact}`}
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
              >
                <Phone className="h-4 w-4 mr-1.5" />
                Contact
              </a>
            </div>
            <NavLink
              to={`/legal-hub/${service.id}`}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 group-hover:translate-x-1 transition-transform"
            >
              View details
              <ChevronRight className="h-4 w-4 ml-1" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
