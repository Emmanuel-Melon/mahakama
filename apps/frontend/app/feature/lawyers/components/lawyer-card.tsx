import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Briefcase, ChevronRight, CalendarClock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@mah/ui/components/avatar";
import { BookmarkButton } from "@mah/ui";
import { ShareButton } from "@mah/ui/components/molecules/ShareButton";
import { MahButton } from "@mah/ui/components/molecules/MahButton";
import { MahCard } from "@mah/ui/components/atoms/MahCard";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";
import { ConsultationRequestDialog } from "~/feature/consultations/components/ConsultationRequestDialog";

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
  isAuthenticated?: boolean;
}

const handleBookmark = (e: React.MouseEvent) => {
  e.preventDefault();
  console.log("Bookmarking lawyer:");
};

const handleShare = (e: React.MouseEvent) => {
  e.preventDefault();
  console.log("Sharing lawyer:");
};

export function LawyerCard({
  lawyer,
  isAuthenticated = false,
  variant = "default",
  displayMode = "list",
}: LawyerCardProps) {
  const navigate = useNavigate();
  const [requestOpen, setRequestOpen] = useState(false);

  const getExperienceText = (years?: number) => {
    if (years === undefined || years === null) return "No experience";
    return years === 1 ? `${years} year` : `${years} years`;
  };

  const handleRequestConsultation = () => {
    if (isAuthenticated) {
      setRequestOpen(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <MahCard
      variant={displayMode === "grid" ? "default" : "minimal"}
      className={displayMode === "grid" ? "group" : ""}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex justify-start">
          <Avatar
            className="w-20 h-20 border-2 border-gray-900 flex-shrink-0"
            style={{
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <AvatarImage
              src={`https://picsum.photos/seed/lawyer-${lawyer.id}/200/200.jpg`}
              alt={`${lawyer.name} profile picture`}
            />
            <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
              {lawyer.name
                ? lawyer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "LW"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex gap-2">
          <ShareButton
            onClick={handleShare}
            className="p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000]"
            aria-label="Share lawyer"
          />
          <BookmarkButton
            onClick={handleBookmark}
            className="p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000]"
            aria-label="Bookmark lawyer"
          />
        </div>
      </div>

      <div className="text-left mb-4">
        <h3 className="text-xl">{lawyer.name || "Unnamed Lawyer"}</h3>
        {lawyer.location && (
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{lawyer.location}</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {lawyer.specialization && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="font-medium">{lawyer.specialization}</span>
          </div>
        )}
        {lawyer.experienceYears && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="font-medium">
              {getExperienceText(lawyer.experienceYears)}
            </span>
          </div>
        )}
      </div>
      <div className="mt-auto pt-4">
        <div className="flex gap-2">
          <MahButton
            href={`/lawyers/${lawyer.id}`}
            variant="card"
            className="flex-1"
          >
            View {getFirstName(lawyer.name)}'s Profile
            <ChevronRight className="h-4 w-4 ml-1" />
          </MahButton>
          <MahButton
            variant="secondary"
            className="flex-1"
            onClick={handleRequestConsultation}
          >
            Request Consultation
            <CalendarClock className="h-4 w-4 ml-1" />
          </MahButton>
        </div>
      </div>

      <ConsultationRequestDialog
        lawyer={lawyer}
        open={requestOpen}
        onOpenChange={setRequestOpen}
      />
    </MahCard>
  );
}
