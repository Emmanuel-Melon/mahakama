import { useTranslation } from "react-i18next";
import { FolderOpen } from "lucide-react";
import { PageHeader } from "@mah/ui";
import { AsyncContainer } from "@mah/ui";
import type { AsyncState } from "@mah/api/src/api/api.types";
import type { Matter } from "@mah/api/src/clients/matters.api";
import { MattersPaths } from "../MattersConfig";
import { MatterHeader } from "../components/MatterHeader";
import { MatterSummaryCard } from "../components/MatterSummaryCard";
import { MatterChatPanel } from "../components/MatterChatPanel";
import { MatterTabs } from "../components/MatterTabs";

interface MatterDetailScreenProps extends AsyncState {
  matter?: Matter;
  role: "lawyer" | "user";
  currentUserId?: string;
}

export const MatterDetailScreen = ({
  matter,
  isLoading,
  error,
  role,
  currentUserId,
}: MatterDetailScreenProps) => {
  const { t } = useTranslation("matters");

  const breadcrumbs = [
    { label: t("title"), to: MattersPaths.index(), icon: FolderOpen },
    { label: matter?.title ?? t("title"), to: "#" },
  ];

  return (
    <AsyncContainer
      data={matter}
      isLoading={isLoading}
      error={error}
      loadingComponent={
        <div className="text-center py-12 text-muted-foreground">
          {t("loadingDetail.description")}
        </div>
      }
      emptyState={{
        icon: FolderOpen,
        badge: t("title"),
        title: t("notFound.title"),
        description: t("notFound.description"),
      }}
    >
      {matter && (
        <div className="w-full">
          <PageHeader breadcrumbs={breadcrumbs} className="hidden sm:flex" />

          <MatterHeader matter={matter} role={role} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
              <MatterSummaryCard matter={matter} role={role} />
              <MatterTabs
                matter={matter}
                role={role}
                currentUserId={currentUserId}
              />
            </div>

            <MatterChatPanel chatId={matter.sourceChatId} />
          </div>
        </div>
      )}
    </AsyncContainer>
  );
};
