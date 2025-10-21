import {
  MapPin,
  Briefcase,
  Star,
  ChevronRight,
  Languages,
  User,
} from "lucide-react";
import { Button } from "app/components/ui/button";
import { HandDrawnAvatar } from "app/components/ui/hand-drawn-avatar";
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
            <HandDrawnAvatar
              name={lawyer.name}
              size={displayMode === "grid" ? "md" : "lg"}
              color="outline"
              className="flex-shrink-0"
            />

            <div>
              <h3 className="text-xl font-black text-gray-900 font-serif">
                {lawyer.name || "Unnamed Lawyer"}
              </h3>
              <p className="text-sm text-gray-600">
                {lawyer.specialization || "Legal Professional"}
                {lawyer.experience &&
                  ` • ${lawyer.experience} ${lawyer.experience === 1 ? "year" : "years"} experience`}
              </p>
              {location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1.5" />
                  {location}
                </div>
              )}
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
        </div>

        <div className="mb-4 space-y-2">
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

        <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-300 flex gap-3">
          <NavLink
            to={`/lawyers/${lawyer.id}`}
            className={({
              isActive,
              isPending,
            }: {
              isActive: boolean;
              isPending: boolean;
            }) =>
              `group flex-1 flex items-center justify-center px-4 text-sm font-bold transition-colors bg-yellow-400 hover:bg-yellow-300 border-2 border-gray-900 rounded-[4px_12px_4px_12px] shadow-[2px_2px_0_0_#000] hover:bg-gray-100 w-fit ${
                isActive ? "text-gray-900" : "text-gray-700 hover:text-gray-900"
              }`
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
