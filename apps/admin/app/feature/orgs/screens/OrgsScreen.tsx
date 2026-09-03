import { useTranslation } from "react-i18next";
import { useOrgs } from "@mah/api/src/hooks/use-orgs";
import type { Org } from "@mah/api/src/clients/orgs.api";
import { EmptyState, EmptyHeader, EmptyTitle, EmptyDescription } from "@mah/ui/components/Empty";
import { LoadingState } from "@mah/ui/components/organisms/async-state/LoadingState";
import { OrgCreateDialog } from "../components/OrgCreateDialog";
import { Card } from "@mah/ui/components/Card";
import { CardContent } from "@mah/ui/components/Card";

interface OrgsScreenProps {
  onCreateSuccess?: () => void;
}

export function OrgsScreen({ onCreateSuccess }: OrgsScreenProps) {
  const { t } = useTranslation("orgs");
  const { data, isLoading, error } = useOrgs();

  if (isLoading) {
    return <LoadingState label={t("title")} title={t("subtitle")} />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{t("toast.createError")}</p>
      </div>
    );
  }

  const orgs = data?.data ?? [];
  const total = data?.metadata?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-600 mt-1">{t("subtitle")}</p>
        </div>
        <OrgCreateDialog onSuccess={onCreateSuccess} />
      </div>

      {orgs.length === 0 ? (
        <EmptyState>
          <EmptyHeader>
            <EmptyTitle>{t("empty.title")}</EmptyTitle>
            <EmptyDescription>{t("empty.description")}</EmptyDescription>
          </EmptyHeader>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgs.map((org) => (
            <Card key={org.id} className="p-0 overflow-hidden">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{org.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{org.slug}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>ID: {org.id.slice(0, 8)}...</span>
                    <span>Created: {new Date(org.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}