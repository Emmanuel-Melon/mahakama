import { useTranslation } from "react-i18next";
import { useLawyers } from "@mah/api/src/hooks/use-lawyers";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";
import { LoadingState } from "~/components/async-state/LoadingState";
import { EmptyState } from "~/components/async-state/EmptyState";
import { LawyerProfileCard } from "../components/LawyerProfileCard";

interface LawyerProfilesScreenProps {
  statusFilter: string | null;
  onStatusChange: (status: string | null) => void;
  onSelectLawyer: (lawyer: Lawyer) => void;
}

const TABS = [
  { value: null, key: "all" },
  { value: "submitted", key: "submitted" },
  { value: "approved", key: "approved" },
  { value: "rejected", key: "rejected" },
] as const;

export function LawyerProfilesScreen({
  statusFilter,
  onStatusChange,
  onSelectLawyer,
}: LawyerProfilesScreenProps) {
  const { t } = useTranslation("lawyers");
  const filters = statusFilter ? { status: statusFilter } : undefined;
  const { data, isLoading, error } = useLawyers(filters);

  if (isLoading) {
    return <LoadingState label={t("title")} />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Failed to load lawyer profiles.</p>
      </div>
    );
  }

  const lawyers = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-600 mt-1">{t("subtitle")}</p>
      </div>

      <div className="flex gap-2 border-b-2 border-gray-200 pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onStatusChange(tab.value)}
            className={`px-4 py-2 text-sm font-bold border-2 border-b-0 rounded-t-lg transition-all ${
              statusFilter === tab.value
                ? "bg-yellow-400 text-gray-900 border-gray-900"
                : "bg-white text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {t(`tabs.${tab.key}`)}
          </button>
        ))}
      </div>

      {lawyers.length === 0 ? (
        <EmptyState
          label={t("title")}
          title={t("empty.title")}
          description={t("empty.description")}
          showDefaultActions={false}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lawyers.map((lawyer) => (
            <LawyerProfileCard
              key={lawyer.id}
              lawyer={lawyer}
              onClick={() => onSelectLawyer(lawyer)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
