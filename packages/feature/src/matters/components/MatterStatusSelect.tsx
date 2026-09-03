import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mah/ui/components/select";
import type { Matter } from "@mah/api/src/clients/matters.api";

const STATUS_OPTIONS: Matter["status"][] = [
  "draft",
  "open",
  "waiting_client",
  "waiting_lawyer",
  "in_progress",
  "resolved",
  "closed",
  "archived",
];

interface MatterStatusSelectProps {
  status: Matter["status"];
  onValueChange: (status: string) => void;
  disabled?: boolean;
}

export function MatterStatusSelect({
  status,
  onValueChange,
  disabled,
}: MatterStatusSelectProps) {
  const { t } = useTranslation("matters");

  return (
    <Select value={status} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="h-7 w-fit gap-1.5 rounded-md border-2 border-gray-900 text-xs shadow-none [&_svg]:size-3.5">
        <span className="sr-only">{t("header.changeStatus")}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((statusOption) => (
          <SelectItem key={statusOption} value={statusOption}>
            {t(`status.${statusOption}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
