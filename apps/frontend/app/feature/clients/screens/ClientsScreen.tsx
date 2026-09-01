import { EmptyState } from "@mah/ui";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import { Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Client } from "@mah/api/src/clients/clients.api";
import type { AsyncState } from "@mah/api/src/api/api.types";
import { ClientCard } from "../components/ClientCard";

interface ClientsScreenProps extends AsyncState {
  clients: Client[];
}

export const ClientsScreen = ({ clients, isLoading }: ClientsScreenProps) => {
  const { t } = useTranslation("clients");

  if (isLoading) {
    return (
      <PageLoading
        title={t("loading")}
        description={t("loadingDescription")}
        skeletonCount={5}
      />
    );
  }

  if (clients.length === 0) {
    return (
      <EmptyState>
        <EmptyState.Visual icon={Briefcase} />
        <EmptyState.Content>
          <EmptyState.Title>{t("empty.title")}</EmptyState.Title>
          <EmptyState.Description>
            {t("empty.description")}
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
};
