import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mah/ui/components/dialog";
import { Button } from "@mah/ui/components/Button";
import { Input } from "@mah/ui/components/Input";
import { Label } from "@mah/ui/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mah/ui/components/select";

const PRACTICE_AREAS = [
  "Corporate Law",
  "Criminal Law",
  "Family Law",
  "Real Estate Law",
  "Immigration Law",
  "Intellectual Property",
  "Tax Law",
  "Environmental Law",
  "Civil Rights",
  "Bankruptcy Law",
] as const;

const openMatterFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  jurisdiction: z.string().trim().optional(),
  practiceArea: z.string().optional(),
  isSharedWithLawyer: z.boolean().default(false),
});

export type OpenMatterFormValues = z.infer<typeof openMatterFormSchema>;

interface OpenMatterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTitle: string;
  summaryPreview?: string | null;
  isSubmitting?: boolean;
  onSubmit: (values: OpenMatterFormValues) => void;
}

export const OpenMatterDialog = ({
  open,
  onOpenChange,
  defaultTitle,
  summaryPreview,
  isSubmitting = false,
  onSubmit,
}: OpenMatterDialogProps) => {
  const { t } = useTranslation("matters");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpenMatterFormValues>({
    resolver: zodResolver(openMatterFormSchema),
    defaultValues: {
      title: defaultTitle,
      jurisdiction: "",
      practiceArea: "",
      isSharedWithLawyer: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: defaultTitle,
        jurisdiction: "",
        practiceArea: "",
        isSharedWithLawyer: false,
      });
    }
  }, [open, defaultTitle, reset]);

  const handleValidSubmit = (values: OpenMatterFormValues) => {
    onSubmit({
      title: values.title,
      jurisdiction: values.jurisdiction,
      practiceArea: values.practiceArea,
      isSharedWithLawyer: values.isSharedWithLawyer,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(handleValidSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("open.dialog.title")}</DialogTitle>
            <DialogDescription>{t("open.dialog.subtitle")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="matter-title">
                {t("open.dialog.titleLabel")}
              </Label>
              <Input
                id="matter-title"
                placeholder={t("open.dialog.titlePlaceholder")}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-600">
                  {t("open.dialog.titleRequired")}
                </p>
              )}
            </div>

            <div className="space-y-2 rounded-lg border bg-background p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium tracking-wider text-gray-500">
                  {t("open.dialog.summaryLabel")}
                </span>
                <Sparkles className="h-4 w-4 text-gray-400" />
              </div>
              {summaryPreview ? (
                <p className="text-sm leading-relaxed text-gray-700 line-clamp-4 whitespace-pre-wrap">
                  {summaryPreview}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  {t("open.dialog.summaryEmpty")}
                </p>
              )}
              <p className="text-xs text-gray-400">
                {t("open.dialog.summaryHint")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matter-jurisdiction">
                {t("open.dialog.jurisdiction")}
              </Label>
              <Input
                id="matter-jurisdiction"
                placeholder={t("open.dialog.jurisdictionPlaceholder")}
                {...register("jurisdiction")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matter-practice-area">
                {t("open.dialog.practiceArea")}
              </Label>
              <Controller
                control={control}
                name="practiceArea"
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("open.dialog.practiceAreaPlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PRACTICE_AREAS.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-800 select-none">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-gray-900"
                {...register("isSharedWithLawyer")}
              />
              <span>{t("open.dialog.requestLawyer")}</span>
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("lawyers.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("open.dialog.opening")
                : t("open.dialog.open")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};