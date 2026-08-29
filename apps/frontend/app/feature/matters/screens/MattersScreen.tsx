import { useTranslation } from "react-i18next";
import { FolderOpen } from "lucide-react";
import { EmptyState, ErrorState } from "@mah/ui";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import type { Matter } from "@mah/api/src/clients/matters.api";
import type { AsyncState } from "@mah/api/src/api/api.types";
import { MatterCard } from "../components/MatterCard";

interface MattersScreenProps extends AsyncState {
  matters: Matter[];
}

export const MattersScreen = ({
  matters,
  isLoading,
  error,
}: MattersScreenProps) => {
  const { t } = useTranslation("matters");

  if (isLoading) {
    return (
      <PageLoading
        title={t("loading.title")}
        description={t("loading.description")}
        skeletonCount={5}
        displayMode="list"
      />
    );
  }

  if (error) {
    return (
      <ErrorState>
        <ErrorState.Visual />
        <ErrorState.Header>
          <ErrorState.Subtitle>{t("title")}</ErrorState.Subtitle>
          <ErrorState.Title>
            {error.errors?.[0]?.detail ?? "Failed to load matters"}
          </ErrorState.Title>
          <ErrorState.Description>
            {t("empty.description")}
          </ErrorState.Description>
        </ErrorState.Header>
      </ErrorState>
    );
  }

  if (matters.length === 0) {
    return (
      <EmptyState>
        <EmptyState.Visual icon={FolderOpen} />
        <EmptyState.Content>
          <EmptyState.Badge>{t("title")}</EmptyState.Badge>
          <EmptyState.Title>{t("empty.title")}</EmptyState.Title>
          <EmptyState.Description>{t("empty.description")}</EmptyState.Description>
        </EmptyState.Content>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {matters.map((matter) => (
        <MatterCard key={matter.id} matter={matter} />
      ))}
    </div>
  );
};