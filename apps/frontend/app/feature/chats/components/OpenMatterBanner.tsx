import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mah/ui/components/Button";

interface OpenMatterBannerProps {
  chatId: string;
  onOpenAsMatter: () => void;
}

const dismissKey = (chatId: string) =>
  `mahakama:open-matter-banner:dismissed:${chatId}`;

export const OpenMatterBanner = ({
  chatId,
  onOpenAsMatter,
}: OpenMatterBannerProps) => {
  const { t } = useTranslation("chats");

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(dismissKey(chatId)) === "1";
  });

  if (dismissed) return null;

  const dismiss = () => {
    window.localStorage.setItem(dismissKey(chatId), "1");
    setDismissed(true);
  };

  return (
    <div className="pt-4">
      <div className="flex flex-col gap-3 rounded-xl border-2 border-gray-900 bg-white p-4 shadow-[3px_3px_0_0_#000] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <FolderOpen className="mt-0.5 h-5 w-5 shrink-0 text-gray-700" />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {t("openMatter.banner.title")}
            </p>
            <p className="mt-0.5 text-sm text-gray-600">
              {t("openMatter.banner.description")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={dismiss}>
            {t("openMatter.banner.notNow")}
          </Button>
          <Button type="button" size="sm" onClick={onOpenAsMatter}>
            {t("openMatter.banner.openAsMatter")}
          </Button>
        </div>
      </div>
    </div>
  );
};