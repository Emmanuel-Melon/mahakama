import { useTranslation } from "react-i18next";
import {
  FolderOpen,
  MapPin,
  Scale,
  CalendarClock,
  Briefcase,
  UserRound,
} from "lucide-react";
import { Badge } from "@mah/ui/components/badge";
import { PageHeader } from "@mah/ui";
import { PageDetailHeader } from "@mah/ui";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { EmptyState, ErrorState } from "@mah/ui";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import { useUser } from "@mah/api/src/hooks/use-users";
import type { AsyncState } from "@mah/api/src/api/api.types";
import type { Matter, MatterTimelineEntry } from "@mah/api/src/clients/matters.api";
import { MattersPaths } from "../MattersConfig";
import { MatterLawyersCard } from "../components/MatterLawyersCard";
import { LawyerInvitePanel } from "../components/LawyerInvitePanel";

type BadgeVariant = "default" | "secondary" | "destructive";

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  draft: "secondary",
  open: "default",
  waiting_client: "secondary",
  waiting_lawyer: "secondary",
  in_progress: "default",
  resolved: "default",
  closed: "secondary",
  archived: "secondary",
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "—";

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

interface MatterDetailScreenProps extends AsyncState {
  matter?: Matter;
  timeline?: MatterTimelineEntry[];
  role: "lawyer" | "user";
}

export const MatterDetailScreen = ({
  matter,
  timeline = [],
  isLoading,
  error,
  role,
}: MatterDetailScreenProps) => {
  const { t } = useTranslation("matters");
  const clientQuery = useUser(matter?.clientUserId || "");

  const clientName = clientQuery.data?.data?.name || t("fields.client");

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
    {
      label: matter.id.slice(0, 8),
      to: `#`,
    },
  ];

  const metadata = [
    {
      icon: Scale,
      label: t("fields.status"),
      value: t(`status.${matter.status}`),
    },
    {
      icon: CalendarClock,
      label: t("fields.opened"),
      value: formatDate(matter.createdAt),
    },
  ];

  const timelineItems = timeline.map((entry) => ({
    id: entry.id,
    label: entry.type === "status_history" ? "Status" : "Event",
    date: formatDateTime(entry.timestamp),
  }));

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} className="hidden sm:flex" />

      <PageDetailHeader
        type={t("fields.caseDetails")}
        title={matter.title}
        description={matter.summary || "—"}
        icon={FolderOpen}
        metadata={metadata}
        className="mt-4"
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardWithLabel
            label={t("fields.overview")}
            className="bg-white p-6"
            labelClassName="text-xs font-medium tracking-wider text-gray-500"
          >
            <p className="text-gray-800 whitespace-pre-wrap">
              {matter.summary || "—"}
            </p>
          </CardWithLabel>

          {role === "lawyer" ? (
            <LawyerInvitePanel matter={matter} />
          ) : (
            <MatterLawyersCard matterId={matter.id} role={role} />
          )}

          <CardWithLabel
            label={t("fields.timeline")}
            className="bg-white p-6"
            labelClassName="text-xs font-medium tracking-wider text-gray-500"
          >
            {timelineItems.length > 0 ? (
              <div className="divide-y divide-dashed divide-gray-200">
                {timelineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 first:pt-0"
                  >
                    <span className="text-sm font-medium text-gray-500">
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-900">{item.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">—</p>
            )}
          </CardWithLabel>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <CardWithLabel
            label={t("fields.matterDetails")}
            className="bg-white p-6"
            labelClassName="text-xs font-medium tracking-wider text-gray-500"
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  {t("fields.status")}
                </div>
                <Badge variant={STATUS_VARIANT[matter.status] ?? "secondary"}>
                  {t(`status.${matter.status}`)}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  {t("fields.client")}
                </div>
                <div className="flex items-center gap-2 text-gray-900">
                  <UserRound className="h-4 w-4 text-gray-400" />
                  {clientName}
                </div>
              </div>
              {matter.jurisdiction && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">
                    {t("fields.jurisdiction")}
                  </div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {matter.jurisdiction}
                  </div>
                </div>
              )}
              {matter.practiceArea && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">
                    {t("fields.practiceArea")}
                  </div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    {matter.practiceArea}
                  </div>
                </div>
              )}
              {matter.urgency && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">
                    {t("fields.urgency")}
                  </div>
                  <div className="text-gray-900">{matter.urgency}</div>
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  {t("fields.created")}
                </div>
                <div className="text-gray-900">
                  {formatDateTime(matter.createdAt)}
                </div>
              </div>
              {matter.closedAt && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">
                    {t("fields.closed")}
                  </div>
                  <div className="text-gray-900">
                    {formatDateTime(matter.closedAt)}
                  </div>
                </div>
              )}
            </div>
          </CardWithLabel>
        </div>
      </div>
    </>
  );
};