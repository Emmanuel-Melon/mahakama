import { useTranslation } from "react-i18next";
import { Check, X, UserRound } from "lucide-react";
import { Button } from "@mah/ui";
import { Badge } from "@mah/ui/components/badge";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import {
  useMatterLawyers,
  useMatterMutations,
} from "@mah/api/src/hooks/use-matters";
import { useLawyerProfile } from "@mah/api/src/hooks/use-lawyers";
import type { Matter } from "@mah/api/src/clients/matters.api";

type BadgeVariant = "default" | "secondary" | "destructive";

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  invited: "secondary",
  active: "default",
  accepted: "default",
  declined: "destructive",
};

export function LawyerInvitePanel({ matter }: { matter: Matter }) {
  const { t } = useTranslation("matters");

  const { data: profileData } = useLawyerProfile();
  const profileId = profileData?.data?.id;

  const { data } = useMatterLawyers(matter.id);
  const assignments = data?.data ?? [];

  const myAssignment = assignments.find(
    (assignment) => assignment.lawyerId === profileId,
  );

  const { updateLawyerMe } = useMatterMutations();

  const status = myAssignment?.status || "invited";
  const statusLabel = t(`lawyers.statuses.${status}`, {
    defaultValue: t("lawyers.statuses.other"),
  });

  const handleRespond = (nextStatus: "accepted" | "declined") => {
    updateLawyerMe.mutate({
      matterId: matter.id,
      data: {
        status: nextStatus,
        acceptedAt: nextStatus === "accepted" ? new Date().toISOString() : null,
      },
    });
  };

  const isPending = status === "invited";
  const busy = updateLawyerMe.isPending;

  return (
    <CardWithLabel
      label={t("invite.myStatus")}
      className="bg-white p-6"
      labelClassName="text-xs font-medium tracking-wider text-gray-500"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white">
            <UserRound className="h-4 w-4 text-gray-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">{matter.title}</p>
            <div className="mt-0.5">
              <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>
                {statusLabel}
              </Badge>
            </div>
          </div>
        </div>

        {isPending && (
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRespond("accepted")}
              disabled={busy}
              className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
            >
              <Check className="h-4 w-4" />
              {busy ? t("invite.accepting") : t("invite.accept")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRespond("declined")}
              disabled={busy}
              className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
            >
              <X className="h-4 w-4" />
              {busy ? t("invite.declining") : t("invite.decline")}
            </Button>
          </div>
        )}
      </div>
    </CardWithLabel>
  );
}
