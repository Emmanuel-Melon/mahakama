import { useTranslation } from "react-i18next";
import { FileText, Download } from "lucide-react";
import { IconContainer } from "@mah/ui/components/IconContainer";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import { useMatterDocuments } from "@mah/api/src/hooks/use-matters";
import type { MatterDocument } from "@mah/api/src/clients/matters.api";

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "—";

const formatSize = (bytes?: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function DocumentRow({ document }: { document: MatterDocument }) {
  const { t } = useTranslation("matters");
  const size = formatSize(document.fileSize);

  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <IconContainer icon={FileText} size="sm" color="handdrawn" />
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
      {document.fileUrl ? (
        <a
          href={document.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          <Download className="h-3.5 w-3.5" />
          {t("documents.download")}
        </a>
      ) : null}
    </div>
  );
}

export function MatterDocumentsTab({ matterId }: { matterId: string }) {
  const { t } = useTranslation("matters");
  const { data, isLoading } = useMatterDocuments(matterId);

  if (isLoading) {
    return (
      <PageLoading
        title={t("loadingDetail.title")}
        description={t("loadingDetail.description")}
        skeletonCount={2}
      />
    );
  }

  const documents = data?.data ?? [];

  if (documents.length === 0) {
    return <p className="text-sm text-gray-500">{t("documents.empty")}</p>;
  }

  return (
    <div className="divide-y divide-dashed divide-gray-200">
      {documents.map((document) => (
        <DocumentRow key={document.id} document={document} />
      ))}
    </div>
  );
}