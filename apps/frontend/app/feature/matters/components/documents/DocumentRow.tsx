import { useTranslation } from "react-i18next";
import { FileText, Search, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router";
import { IconContainer } from "@mah/ui/components/IconContainer";
import type { MatterDocument } from "@mah/api/src/clients/matters.api";
import { MattersPaths } from "../../MattersConfig";
import { formatDate, formatSize } from "./documents.utils";

export function DocumentRow({ document }: { document: MatterDocument }) {
  const { t } = useTranslation("matters");
  const size = formatSize(document.fileSize);
  const isAnalyzed = Boolean(document.analyzedAt);

  return (
    <Link
      to={MattersPaths.document({
        matterId: document.matterId,
        documentId: document.id,
      })}
      className="flex flex-col gap-2 py-3 px-3 hover:bg-gray-50 rounded-lg border border-gray-100 bg-white transition-colors"
    >
      <div className="flex items-center gap-3">
        <IconContainer icon={FileText} size="sm" color="outline" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {document.fileName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {document.fileType || "—"}
            {size ? ` · ${size}` : ""} · {t("documents.uploaded")}{" "}
            {formatDate(document.createdAt)}
          </p>
        </div>
        <Search className="h-4 w-4 text-gray-400 shrink-0" />
      </div>

      {document.description && (
        <p className="text-xs text-gray-600 line-clamp-2 pl-9">
          {document.description}
        </p>
      )}

      <div className="flex items-center gap-3 pl-9 pt-1 text-[10px] text-gray-500">
        <span className="flex items-center gap-1 font-medium">
          {isAnalyzed ? (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-700">Analyzed</span>
            </>
          ) : (
            <>
              <Clock className="h-3 w-3 text-amber-500" />
              <span className="text-amber-600">Pending Analysis</span>
            </>
          )}
        </span>
        {document.uploadedByUserId && (
          <>
            <span>·</span>
            <span>User ID: {document.uploadedByUserId}</span>
          </>
        )}
      </div>
    </Link>
  );
}
