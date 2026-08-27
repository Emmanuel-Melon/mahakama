import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle, Loader2, FileText } from "lucide-react";
import type { BaseUploadProgress } from "@mah/api/src/hooks/use-upload-manager";

interface UploadProgressCardProps {
  fileName: string;
  progress: BaseUploadProgress;
}

export function UploadProgressCard({
  fileName,
  progress,
}: UploadProgressCardProps) {
  const { t } = useTranslation("corpus");

  const statusIcon = {
    uploading: <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />,
    completed: <CheckCircle className="h-4 w-4 text-green-600" />,
    error: <XCircle className="h-4 w-4 text-red-600" />,
  }[progress.status];

  const statusLabel = {
    uploading: t("upload.uploading"),
    completed: t("upload.completed"),
    error: t("upload.failed"),
  }[progress.status];

  const statusColor = {
    uploading: "text-blue-700",
    completed: "text-green-700",
    error: "text-red-700",
  }[progress.status];

  const barColor = {
    uploading: "bg-blue-500",
    completed: "bg-green-500",
    error: "bg-red-500",
  }[progress.status];

  return (
    <div
      className="border-2 border-gray-900 rounded-lg p-4 bg-white"
      style={{ boxShadow: "2px 2px 0 0 #000" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded border-2 border-gray-900 bg-gray-100 flex items-center justify-center shrink-0">
          <FileText className="h-4 w-4 text-gray-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-sm font-bold text-gray-900 truncate">
              {fileName}
            </p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold ${statusColor}`}
            >
              {statusIcon}
              {statusLabel}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${barColor}`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* Status text */}
          {progress.status === "uploading" && (
            <p className="text-xs text-gray-500 mt-1">
              {t("upload.progress", {
                percentage: Math.round(progress.percentage),
                chunk: progress.totalChunks ?? "–",
                totalChunks: progress.totalChunks ?? "–",
              })}
            </p>
          )}

          {progress.status === "error" && progress.message && (
            <p className="text-xs text-red-600 mt-1">{progress.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
