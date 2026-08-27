import { useTranslation } from "react-i18next";

type Status = "draft" | "submitted" | "approved" | "rejected";

const STATUS_STYLES: Record<
  Status,
  { bg: string; text: string; border: string }
> = {
  submitted: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
  },
  approved: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
  },
  draft: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-300",
  },
};

interface LawyerStatusBadgeProps {
  status: Status;
  className?: string;
}

export function LawyerStatusBadge({
  status,
  className = "",
}: LawyerStatusBadgeProps) {
  const { t } = useTranslation("common");
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.draft;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold border-2 rounded-md ${styles.bg} ${styles.text} ${styles.border} ${className}`}
      style={{ boxShadow: "1px 1px 0 0 #000" }}
    >
      {t(`status.${status}`)}
    </span>
  );
}
