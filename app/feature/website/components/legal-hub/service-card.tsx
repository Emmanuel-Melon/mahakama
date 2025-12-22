import { MapPin, Phone, Globe, ChevronRight, Building2, Scale, HeartHandshake, Shield, Heart } from "lucide-react";
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

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add save functionality here
    console.log('Saving service:', service.name);
  };

  const cardClasses: Record<DisplayMode, string> = {
    grid: "h-full border-2 border-gray-900 bg-white rounded-lg overflow-hidden p-5",
    list: "relative bg-white border-2 border-gray-900 rounded-lg p-6",
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
          <div className="flex-1">
            <h3 className="text-xl font-black text-gray-900 font-serif">
              {service.name}
            </h3>
            {service.location && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">{service.location}</span>
              </div>
            )}
          </div>
          <button
            className="p-2 text-sm font-medium border-2 border-black rounded-lg bg-white shadow-[3px_3px_0_0_#000]"
            aria-label="Save service"
            onClick={handleSave}
          >
            <Heart className="h-4 w-4" />
          </button>
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
            <NavLink
              to={`/legal-hub/${service.id}`}
              viewTransition
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
