import { useTranslation } from "react-i18next";
import { CircleCheck, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mah/ui/components/dialog";
import { Button } from "@mah/ui/components/Button";

interface MatterPreparingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isReady?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onGoToMatter: () => void;
}

export const MatterPreparingSheet = ({
  open,
  onOpenChange,
  isReady = false,
  isError = false,
  onRetry,
  onGoToMatter,
}: MatterPreparingSheetProps) => {
  const { t } = useTranslation("matters");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isError ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("open.error.title")}</DialogTitle>
              <DialogDescription>
                {t("open.error.description")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("open.error.close")}
              </Button>
              <Button type="button" onClick={onRetry}>
                {t("open.error.retry")}
              </Button>
            </DialogFooter>
          </>
        ) : isReady ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CircleCheck className="h-5 w-5 shrink-0 text-green-600" />
                {t("open.ready.title")}
              </DialogTitle>
              <DialogDescription>
                {t("open.ready.description")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                {t("open.ready.close")}
              </Button>
              <Button type="button" onClick={onGoToMatter}>
                {t("open.ready.goToMatter")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-gray-500" />
                {t("open.preparing.title")}
              </DialogTitle>
              <DialogDescription>
                {t("open.preparing.description")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                {t("open.preparing.close")}
              </Button>
              <Button type="button" disabled>
                {t("open.preparing.viewDisabled")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
