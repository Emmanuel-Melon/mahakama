import {
  MapPin,
  Phone,
  Globe,
  ChevronRight,
  Building2,
  Scale,
  HeartHandshake,
  Shield,
  Building,
} from "lucide-react";
import { NavLink } from "react-router";
import { BookmarkButton } from "@mah/ui";
import { ShareButton } from "@mah/ui/components/molecules/ShareButton";
import { MahButton } from "@mah/ui/components/molecules/MahButton";
import { MahCard } from "@mah/ui/components/atoms/MahCard";
import { IconContainer } from "@mah/ui/components/IconContainer";
import { cn } from "~/lib/utils";

type CardVariant = "default" | "minimal";
type DisplayMode = "grid" | "list";

interface ServiceCardProps {
  service: any;
  variant?: CardVariant;
  displayMode?: DisplayMode;
}

const categoryIcons = {
  government: Building2,
  "legal-aid": Scale,
  "dispute-resolution": HeartHandshake,
  specialized: Shield,
} as const;

const categoryLabels = {
  government: "Government",
  "legal-aid": "Legal Aid",
  "dispute-resolution": "Dispute Resolution",
  specialized: "Specialized",
} as const;

export function ServiceCard({
  service,
  variant = "default",
  displayMode = "list",
}: ServiceCardProps) {
  const Icon = categoryIcons[service.category as keyof typeof categoryIcons];
  const categoryLabel =
    categoryLabels[service.category as keyof typeof categoryLabels];

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add save functionality here
    console.log("Saving service:", service.name);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Bookmarking service:", service.name);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Sharing service:", service.name);
  };

  function getColor(arg0: number): string {
    const colors = [
      "text-blue-900",
      "text-green-900",
      "text-purple-900",
      "text-amber-900",
      "text-rose-900",
      "text-emerald-900",
      "text-indigo-900",
      "text-cyan-900",
      "text-fuchsia-900",
      "text-lime-900",
    ];
    return colors[arg0 % colors.length];
  }

  return (
    <MahCard
      variant={displayMode === "grid" ? "default" : "minimal"}
      className={displayMode === "grid" ? "group" : ""}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex justify-start">
          <IconContainer
            icon={Building}
            size="lg"
            color="outline"
            className="flex-shrink-0"
          />
        </div>
        <ShareButton
          onClick={handleShare}
          className="p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000]"
          aria-label="Share service"
        />
      </div>
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex-1">
          <h3 className="text-xl">{service.name}</h3>
          {service.location && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">{service.location}</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

      {service.services.length > 0 && (
        <div className="mt-2 mb-4 flex flex-wrap gap-2">
          {service.services.slice(0, 3).map((s, i) => (
            <span
              key={i}
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                getColor(service.services.length - 3),
              )}
              style={{
                boxShadow: "2px 2px 0 0 #000",
                borderRadius: "4px 8px 4px 8px",
              }}
            >
              {s}
            </span>
          ))}
          {service.services.length > 3 && (
            <span
              className={cn(
                "text-left py-1.5 sm:py-1 px-3 border-2 border-gray-900 bg-white",
                "transition-all hover:shadow-md font-medium text-xs sm:text-sm flex items-center gap-2",
                "active:translate-y-0.5 active:shadow-none hover:bg-gray-50",
                getColor(service.services.length - 3),
              )}
            >
              +{service.services.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="mt-auto pt-4">
        <div className="flex gap-2">
          <MahButton
            href={`/legal-hub/${service.id}`}
            variant="card"
            className="flex-[2]"
          >
            View details
            <ChevronRight className="h-4 w-4 ml-1" />
          </MahButton>
          <BookmarkButton
            onClick={handleBookmark}
            className="p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000] flex-[1] h-full"
            aria-label="Bookmark service"
          />
        </div>
      </div>
    </MahCard>
  );
}
