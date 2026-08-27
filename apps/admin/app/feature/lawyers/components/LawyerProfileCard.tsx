import type { Lawyer } from "@mah/api/src/clients/lawyers.api";
import { MapPin, Briefcase, Clock, Star } from "lucide-react";
import { LawyerStatusBadge } from "./LawyerStatusBadge";

interface LawyerProfileCardProps {
  lawyer: Lawyer;
  onClick?: () => void;
}

export function LawyerProfileCard({ lawyer, onClick }: LawyerProfileCardProps) {
  const submittedDate =
    "submittedAt" in lawyer && lawyer.submittedAt
      ? new Date(lawyer.submittedAt as string).toLocaleDateString()
      : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left border-2 border-gray-900 rounded-lg p-5 bg-white hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      style={{ boxShadow: "3px 3px 0 0 #000" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-mono mb-1">
            {lawyer.userId.slice(0, 8)}…
          </p>
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {lawyer.specialization || "No specialization"}
          </h3>
        </div>
        <LawyerStatusBadge status={lawyer.status} />
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
        {lawyer.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {lawyer.location}
          </span>
        )}
        {lawyer.experienceYears != null && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" /> {lawyer.experienceYears}y exp
          </span>
        )}
        {lawyer.rating && (
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5" /> {lawyer.rating}
          </span>
        )}
      </div>

      {submittedDate && (
        <p className="text-xs text-gray-500">
          <Clock className="h-3 w-3 inline mr-1" />
          Submitted {submittedDate}
        </p>
      )}
    </button>
  );
}
