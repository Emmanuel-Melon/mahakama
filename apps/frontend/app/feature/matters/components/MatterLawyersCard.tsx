import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus, UserRound, CalendarClock } from "lucide-react";
import { Button } from "@mah/ui";
import { Badge } from "@mah/ui/components/badge";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { useMatterLawyers } from "@mah/api/src/hooks/use-matters";
import { useLawyer } from "@mah/api/src/hooks/use-lawyers";
import { useUser } from "@mah/api/src/hooks/use-users";
import type { MatterLawyer } from "@mah/api/src/clients/matters.api";
import { InviteLawyerDialog } from "./InviteLawyerDialog";

type BadgeVariant = "default" | "secondary" | "destructive";

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  invited: "secondary",
  active: "default",
  accepted: "default",
  declined: "destructive",
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "—";

function MatterLawyerRow({ assignment }: { assignment: MatterLawyer }) {
  const { t } = useTranslation("matters");
  const { data: lawyerData } = useLawyer(assignment.lawyerId);
  const lawyer = lawyerData?.data;
  const { data: userData } = useUser(lawyer?.userId ?? "");

  const status = assignment.status || "invited";
  const statusLabel = t(`lawyers.statuses.${status}`, {
    defaultValue: t("lawyers.statuses.other"),
  });

  const detail = [lawyer?.specialization, lawyer?.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white">
          <UserRound className="h-4 w-4 text-gray-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {userData?.data?.name || "—"}
          </p>
          {detail ? (
            <p className="text-xs text-gray-500 truncate">{detail}</p>
          ) : null}
          <p className="text-xs text-gray-400 mt-0.5">
            <CalendarClock className="inline h-3 w-3 mr-1" />
            {t("lawyers.invitedAt")}: {formatDate(assignment.invitedAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>
          {statusLabel}
        </Badge>
      </div>
    </div>
  );
}

export function MatterLawyersCard({
  matterId,
  role,
}: {
  matterId: string;
  role: "lawyer" | "user";
}) {
  const { t } = useTranslation("matters");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useMatterLawyers(matterId);
  const assignments = data?.data ?? [];
  const assignedLawyerIds = assignments.map((assignment) => assignment.lawyerId);

  return (
    <CardWithLabel
      label={t("lawyers.title")}
      className="bg-white p-6"
      labelClassName="text-xs font-medium tracking-wider text-gray-500"
    >
      {role === "user" && (
        <div className="flex items-center justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
          >
            <UserPlus className="h-4 w-4" />
            {t("lawyers.invite")}
          </Button>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">{t("loading.description")}</p>
      ) : assignments.length === 0 ? (
        <p className="text-sm text-gray-500">{t("lawyers.empty")}</p>
      ) : (
        <div className="divide-y divide-dashed divide-gray-200">
          {assignments.map((assignment) => (
            <MatterLawyerRow key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}

      {role === "user" && (
        <InviteLawyerDialog
          matterId={matterId}
          assignedLawyerIds={assignedLawyerIds}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </CardWithLabel>
  );
}