import { useTranslation } from "react-i18next";
import { FolderOpen } from "lucide-react";
import { PageHeader } from "@mah/ui";
import { EmptyState, ErrorState } from "@mah/ui";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@mah/ui/components/tabs";
import type { AsyncState } from "@mah/api/src/api/api.types";
import type { Matter } from "@mah/api/src/clients/matters.api";
import { MattersPaths } from "../MattersConfig";
import { MatterHeader } from "../components/MatterHeader";
import { MatterSummaryCard } from "../components/MatterSummaryCard";
import { MatterTimelineTab } from "../components/MatterTimelineTab";
import { MatterDocumentsTab } from "../components/MatterDocumentsTab";
import { MatterNotesTab } from "../components/MatterNotesTab";
import { MatterChatPanel } from "../components/MatterChatPanel";
import { MatterLawyersCard } from "../components/MatterLawyersCard";
import { MatterShareLawyerNudge } from "../components/MatterShareLawyerNudge";
import { LawyerInvitePanel } from "../components/LawyerInvitePanel";

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

  if (isLoading) {
    return (
      <PageLoading
        title={t("loadingDetail.title")}
        description={t("loadingDetail.description")}
        skeletonCount={3}
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
            {error.errors?.[0]?.detail ?? "Failed to load matter"}
          </ErrorState.Title>
          <ErrorState.Description>
            {t("notFound.description")}
          </ErrorState.Description>
        </ErrorState.Header>
      </ErrorState>
    );
  }

  if (!matter) {
    return (
      <EmptyState>
        <EmptyState.Visual icon={FolderOpen} />
        <EmptyState.Content>
          <EmptyState.Badge>{t("title")}</EmptyState.Badge>
          <EmptyState.Title>{t("notFound.title")}</EmptyState.Title>
          <EmptyState.Description>
            {t("notFound.description")}
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState>
    );
  }

  const breadcrumbs = [
    { label: t("title"), to: MattersPaths.index(), icon: FolderOpen },
    { label: matter.title, to: "#" },
  ];

  return (
    <div className="w-full">
      <PageHeader breadcrumbs={breadcrumbs} className="hidden sm:flex" />

      <MatterHeader matter={matter} role={role} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <MatterSummaryCard matter={matter} role={role} />

          <Tabs defaultValue="timeline">
            <TabsList className="w-full border-b-2 border-gray-900 rounded-none bg-transparent justify-start gap-6 h-auto p-0">
              <TabsTrigger value="timeline" className="flex-none">{t("tabs.timeline")}</TabsTrigger>
              <TabsTrigger value="documents" className="flex-none">
                {t("tabs.documents")}
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-none">{t("tabs.notes")}</TabsTrigger>
              <TabsTrigger value="lawyers" className="flex-none">{t("tabs.lawyers")}</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <MatterTimelineTab
                  matterId={matter.id}
                  role={role}
                  currentUserId={currentUserId}
                />
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <MatterDocumentsTab matterId={matter.id} />
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <MatterNotesTab
                  matterId={matter.id}
                  currentUserId={currentUserId}
                  role={role}
                />
              </div>
            </TabsContent>

            <TabsContent value="lawyers" className="mt-6">
              {role === "lawyer" ? (
                <LawyerInvitePanel matter={matter} />
              ) : (
                <>
                  <MatterShareLawyerNudge matter={matter} />
                  <MatterLawyersCard matterId={matter.id} role={role} />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <MatterChatPanel chatId={matter.sourceChatId} />
      </div>
    </div>
  );
};