import {
  MapPin,
  Briefcase,
  Star,
  ChevronRight,
  Languages,
  User,
  Heart,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { NavLink } from "react-router";
import { BookmarkButton } from "~/components/bookmark-button";
import type { components } from "~/lib/api/generated/api.types";
import { MahButton } from "~/components/mah-button";

export type Lawyer = components["schemas"]["Lawyer"];

const getFirstName = (name?: string) => {
  if (!name) return "Lawyer";
  return name.split(" ")[0];
};

type CardVariant = "default" | "minimal";
type DisplayMode = "grid" | "list";

interface LawyerCardProps {
  lawyer: Lawyer;
  variant?: CardVariant;
  displayMode?: DisplayMode;
}

const handleBookmark = (e: React.MouseEvent) => {
  e.preventDefault();
  console.log('Bookmarking lawyer:');
};

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
            <div className="space-y-2">
              <h3 className="text-xl">
                {lawyer.name || "Unnamed Lawyer"}
              </h3>
              {lawyer.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{lawyer.location}</span>
                </div>
              )}
            </div>
          </div>
          <BookmarkButton
            onClick={handleBookmark}
            className="p-2 text-sm font-medium border-2 border-black rounded-lg bg-white shadow-[3px_3px_0_0_#000]"
            aria-label="Bookmark lawyer"
          />
        </div>

        <div className="mb-4 space-y-2">
          {lawyer.specialization && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{lawyer.specialization}</span>
            </div>
          )}
          {lawyer.experienceYears && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="h-4 w-4" />
              <span className="font-medium">{getExperienceText(lawyer.experienceYears)}</span>
            </div>
          )}
          {languages.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Languages className="h-4 w-4" />
              <span className="font-medium">Languages:</span>
              <span>{languages.join(", ")}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          <MahButton
            to={`/lawyers/${lawyer.id}`}
            size="sm"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border-2 border-black rounded-lg bg-yellow-300 shadow-[3px_3px_0_0_#000] hover:bg-yellow-400 hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] w-full"
          >
            View {getFirstName(lawyer.name)}'s Profile
            <ChevronRight className="h-4 w-4 ml-1" />
          </MahButton>
        </div>
      </div>
    </div>
  );
}
