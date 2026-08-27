import { useTranslation } from "react-i18next";
import { useLawyer } from "@mah/api/src/hooks/use-lawyers";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Star,
  FileText,
  GraduationCap,
} from "lucide-react";
import { LoadingState } from "~/components/async-state/LoadingState";
import { LawyerStatusBadge } from "../components/LawyerStatusBadge";
import { ReviewActions } from "../components/ReviewActions";

interface LawyerProfileDetailScreenProps {
  lawyerId: string;
  onBack: () => void;
}

export function LawyerProfileDetailScreen({
  lawyerId,
  onBack,
}: LawyerProfileDetailScreenProps) {
  const { t } = useTranslation("lawyers");
  const { data, isLoading, error } = useLawyer(lawyerId);

  if (isLoading) {
    return <LoadingState label={t("detail.profileInfo")} />;
  }

  if (error || !data?.data) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Failed to load lawyer profile.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 underline text-sm"
        >
          {t("detail.backToList")}
        </button>
      </div>
    );
  }

  const lawyer = data.data as Lawyer;
  const education = (lawyer as Record<string, unknown>).education as
    { institution?: string; degree?: string; year?: string | number }[] | null;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("detail.backToList")}
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {t("detail.profileInfo")}
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            ID: {lawyer.id}
          </p>
        </div>
        <LawyerStatusBadge status={lawyer.status} />
      </div>

      <ReviewActions lawyer={lawyer} onApproved={onBack} onRejected={onBack} />

      <fieldset className="border-2 border-gray-900 rounded-lg p-5 bg-white">
        <legend className="px-3 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-600 border-2 border-gray-900 rounded-md">
          {t("detail.profileInfo")}
        </legend>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <DetailField
            label={t("detail.specialization")}
            value={lawyer.specialization}
            icon={<Briefcase className="h-4 w-4" />}
          />
          <DetailField
            label={t("detail.experience")}
            value={
              lawyer.experienceYears != null
                ? `${lawyer.experienceYears} years`
                : null
            }
            icon={<Star className="h-4 w-4" />}
          />
          <DetailField
            label={t("detail.location")}
            value={lawyer.location}
            icon={<MapPin className="h-4 w-4" />}
          />
          <DetailField
            label={t("detail.hourlyRate")}
            value={lawyer.rating ? `$${lawyer.rating}/hr` : null}
            icon={<Star className="h-4 w-4" />}
          />
        </dl>
      </fieldset>

      {lawyer.bio && (
        <fieldset className="border-2 border-gray-900 rounded-lg p-5 bg-white">
          <legend className="px-3 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-600 border-2 border-gray-900 rounded-md">
            {t("detail.bio")}
          </legend>
          <p className="text-sm text-gray-700 whitespace-pre-wrap pt-2">
            {lawyer.bio}
          </p>
        </fieldset>
      )}

      {education && education.length > 0 && (
        <fieldset className="border-2 border-gray-900 rounded-lg p-5 bg-white">
          <legend className="px-3 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-600 border-2 border-gray-900 rounded-md">
            {t("detail.education")}
          </legend>
          <ul className="space-y-2 pt-2">
            {education.map((edu, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <GraduationCap className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                <div>
                  {edu.degree && (
                    <span className="font-medium">{edu.degree}</span>
                  )}
                  {edu.institution && (
                    <span className="text-gray-600"> — {edu.institution}</span>
                  )}
                  {edu.year && (
                    <span className="text-gray-400"> ({edu.year})</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      <fieldset className="border-2 border-gray-900 rounded-lg p-5 bg-white">
        <legend className="px-3 text-xs font-bold uppercase tracking-wider bg-yellow-400 text-gray-900 border-2 border-gray-900 rounded-md">
          {t("detail.documents")}
        </legend>
        <p className="text-sm text-gray-500 pt-2">{t("detail.noDocuments")}</p>
      </fieldset>
    </div>
  );
}

function DetailField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 mt-0.5">{icon}</span>
      <div>
        <dt className="text-xs font-bold uppercase text-gray-500">{label}</dt>
        <dd className="text-sm text-gray-900 mt-0.5">{value ?? "—"}</dd>
      </div>
    </div>
  );
}
