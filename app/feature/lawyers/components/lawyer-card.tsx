import {
  MapPin,
  Briefcase,
  Star,
  ChevronRight,
  Languages,
  User,
  Heart,
} from "lucide-react";
import { Button } from "app/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import type { Lawyer } from "~/lib/api/lawyers.api";
import { NavLink } from "react-router";

const getFirstName = (name?: string) => {
  if (!name) return "Lawyer";
  return name.split(" ")[0];
};

type CardVariant = "default" | "minimal";
type DisplayMode = "grid" | "list";

interface LawyerCardProps {
  lawyer: Lawyer;
  variant?: CardVariant;
  /** Controls the layout mode - grid (card) or list */
  displayMode?: DisplayMode;
}

export function LawyerCard({
  lawyer,
  variant = "default",
  displayMode = "list",
}: LawyerCardProps) {
  const getExperienceText = (years?: number) => {
    if (years === undefined || years === null) return "No experience";
    return years === 1 ? `${years} year` : `${years} years`;
  };

  const languages = Array.isArray(lawyer.languages) ? lawyer.languages : [];
  const location = lawyer.bio
    ? lawyer.bio.split(".")[0]
    : lawyer.specialization || "Legal Expert";

  const cardClasses: Record<DisplayMode, string> = {
    grid: "h-full border-2 border-gray-900 bg-white rounded-lg overflow-hidden p-6",
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
          <div className="flex items-center gap-4">
            <Avatar
            className={`${displayMode === "grid" ? "w-15 h-15" : "w-20 h-20"} border-2 border-gray-900 flex-shrink-0`}
            style={{
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <AvatarImage
              src={`https://picsum.photos/seed/lawyer-${lawyer.id}/200/200.jpg`}
              alt={`${lawyer.name} profile picture`}
            />
            <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
              {lawyer.name ? lawyer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "LW"}
            </AvatarFallback>
          </Avatar>

            <div>
              <h3 className="text-md font-black text-gray-900 font-serif">
                {lawyer.name || "Unnamed Lawyer"}
              </h3>

            </div>
          </div>

          {lawyer.isVerified && (
            <div
              className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full border-2 border-gray-900"
              style={{
                boxShadow: "1px 1px 0 0 #000",
              }}
            >
              <Star className="h-4 w-4 fill-green-400 text-green-500" />
              <span className="text-sm font-bold">Verified</span>
            </div>
          )}
          <button
            className="p-2 text-sm font-medium border-2 border-black rounded-lg bg-white shadow-[3px_3px_0_0_#000]"
            aria-label="Save lawyer"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <Badge
            variant="outline"
            className="border-2 border-gray-900 bg-white"
            style={{
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            {lawyer.specialization || "Legal Professional"}
            {lawyer.experience &&
              ` • ${lawyer.experience} ${lawyer.experience === 1 ? "year" : "years"} experience`}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Briefcase className="w-4 h-4" />
            <span className="font-medium">Experience:</span>
            <span>{getExperienceText(lawyer.experience)}</span>
            {lawyer.barNumber && (
              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {lawyer.barNumber}
              </span>
            )}
          </div>

          {languages.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Languages className="w-4 h-4" />
              <span className="font-medium">Languages:</span>
              <span>{languages.join(", ")}</span>
            </div>
          )}

          {lawyer.phone && (
            <div className="mt-2 text-sm text-gray-600">
              <a
                href={`tel:${lawyer.phone}`}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>📞</span> {lawyer.phone}
              </a>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-300">
          <NavLink
            to={`/lawyers/${lawyer.id}`}
            viewTransition
            className={({
              isActive,
              isPending,
            }: {
              isActive: boolean;
              isPending: boolean;
            }) =>
              `flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border-2 border-black rounded-lg bg-yellow-300 shadow-[3px_3px_0_0_#000] w-full`
            }
          >
            {({
              isActive,
              isPending,
            }: {
              isActive: boolean;
              isPending: boolean;
            }) => (
              <>
                <User className="w-4 h-4 mr-2" />
                <span>View {getFirstName(lawyer.name)}'s Profile</span>
                {isPending && <span className="ml-1">...</span>}
              </>
            )}
          </NavLink>
        </div>
      </div>
    </div>
  );
}
