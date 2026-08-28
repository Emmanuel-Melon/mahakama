import { useTranslation } from "react-i18next";
import { Button } from "@mah/ui";

export const DashboardScreen = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>

      <div>
        {/* pending invites count wired up once lawyer-invites hooks exist */}
        <h2>{t("widgets.pendingInvites.label")}</h2>
      </div>

      <div>
        {/* awaiting-review count wired up once lawyer-profiles hooks exist */}
        <h2>{t("widgets.profilesAwaitingReview.label")}</h2>
      </div>
      <Button className="bg-red-500">
        {t("widgets.profilesAwaitingReview.label")}
      </Button>
    </div>
  );
};
