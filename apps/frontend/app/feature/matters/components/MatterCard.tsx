import { useTranslation } from "react-i18next";
import { ChevronRight, FolderOpen } from "lucide-react";
import { Badge } from "@mah/ui/components/badge";
import { MahButton } from "@mah/ui/components/molecules/MahButton";
import { MahCard } from "@mah/ui/components/atoms/MahCard";
import type { Matter } from "@mah/api/src/clients/matters.api";
import { MattersPaths } from "../MattersConfig";

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

interface MatterCardProps {
  matter: Matter;
}

export const MatterCard = ({ matter }: MatterCardProps) => {
  const { t } = useTranslation("matters");

  return (
    <MahCard variant="minimal">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Badge
            variant={STATUS_VARIANT[matter.status] ?? "secondary"}
            className="shrink-0"
          >
            {t(`status.${matter.status}`)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {t("fields.created")} {formatDate(matter.createdAt)}
          </span>
        </div>
        <FolderOpen className="h-5 w-5 text-muted-foreground shrink-0" />
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-1">
        {matter.title}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {matter.summary || "—"}
      </p>

      {(matter.jurisdiction || matter.practiceArea) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {matter.jurisdiction && (
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {matter.jurisdiction}
            </span>
          )}
          {matter.practiceArea && (
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {matter.practiceArea}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <MahButton
          href={MattersPaths.detail({ matterId: matter.id })}
          variant="card"
          className="w-full"
        >
          {t("actions.viewDetails")}
          <ChevronRight className="h-4 w-4 ml-1" />
        </MahButton>
      </div>
    </MahCard>
  );
};