import { useTranslation } from "react-i18next";
import {
  ArrowRightLeft,
  CalendarDays,
  Cog,
  FileText,
  FolderOpen,
  MessagesSquare,
  Sparkles,
  StickyNote,
  UserCheck,
  UserPlus,
  UserX,
  EyeOff,
} from "lucide-react";
import { Badge } from "@mah/ui/components/badge";
import { IconContainer } from "@mah/ui/components/IconContainer";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import { useMatterTimeline } from "@mah/api/src/hooks/use-matters";
import type { MatterTimelineEntry } from "@mah/api/src/clients/matters.api";

const TYPE_ICONS: Record<string, typeof FolderOpen> = {
  matter_created: FolderOpen,
  status_changed: ArrowRightLeft,
  note_added: StickyNote,
  document_uploaded: FileText,
  lawyer_invited: UserPlus,
  lawyer_accepted: UserCheck,
  lawyer_declined: UserX,
  event_created: CalendarDays,
  event_updated: CalendarDays,
  event_completed: CalendarDays,
  chat_linked: MessagesSquare,
  summary_updated: Sparkles,
  system: Cog,
};

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

function TimelineRow({
  entry,
  currentUserId,
}: {
  entry: MatterTimelineEntry;
  currentUserId?: string;
}) {
  const { t } = useTranslation("matters");
  const Icon = TYPE_ICONS[entry.type] ?? CalendarDays;

  return (
    <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col items-center shrink-0">
        <IconContainer icon={Icon} size="sm" color="handdrawn" />
        <div className="w-px flex-1 bg-gray-200 mt-1" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{entry.title}</p>
          {entry.isInternal && (
            <Badge variant="secondary">
              <EyeOff className="h-3 w-3" />
              {t("timeline.internal")}
            </Badge>
          )}
        </div>
        {entry.description ? (
          <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-wrap">
            {entry.description}
          </p>
        ) : null}
        <p className="text-xs text-gray-400 mt-1">
          {entry.actorUserId === currentUserId ? `${t("timeline.you")} · ` : ""}
          {formatDateTime(entry.timestamp)}
        </p>
      </div>
    </div>
  );
}

export function MatterTimelineTab({
  matterId,
  role,
  currentUserId,
}: {
  matterId: string;
  role: "lawyer" | "user";
  currentUserId?: string;
}) {
  const { t } = useTranslation("matters");
  const { data: timeline, isLoading } = useMatterTimeline(matterId);

  if (isLoading) {
    return (
      <PageLoading
        title={t("loadingDetail.title")}
        description={t("loadingDetail.description")}
        skeletonCount={3}
      />
    );
  }

  const entries = (timeline ?? []).filter(
    (entry) => role === "lawyer" || !entry.isInternal,
  );

  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">{t("timeline.empty")}</p>;
  }

  return (
    <div>
      {entries.map((entry) => (
        <TimelineRow
          key={entry.id}
          entry={entry}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
