import { useTranslation } from "react-i18next";
import { Scale } from "lucide-react";
import { Button } from "@mah/ui";
import { useMatterMutations } from "@mah/api/src/hooks/use-matters";
import type { Matter } from "@mah/api/src/clients/matters.api";

export function MatterShareLawyerNudge({ matter }: { matter: Matter }) {
  const { t } = useTranslation("matters");
  const { updateMatter } = useMatterMutations();

  if (matter.isSharedWithLawyer) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border-2 border-black bg-blue-50 p-4 shadow-[3px_3px_0_0_#000] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black bg-white">
          <Scale className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {t("share.nudgeTitle")}
          </p>
          <p className="mt-0.5 text-sm text-gray-600">
            {t("share.nudgeDescription")}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 gap-2 rounded-lg border-2 border-black bg-white text-gray-900 shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]"
        disabled={updateMatter.isPending}
        onClick={() =>
          updateMatter.mutate({
            matterId: matter.id,
            data: { isSharedWithLawyer: true },
          })
        }
      >
        {updateMatter.isPending ? t("share.sharing") : t("share.share")}
      </Button>
    </div>
  );
}