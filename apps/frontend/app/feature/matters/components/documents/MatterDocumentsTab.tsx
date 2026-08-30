import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Paperclip } from "lucide-react";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import { Button } from "@mah/ui";
import {
  useMatterDocuments,
  useMatterMutations,
} from "@mah/api/src/hooks/use-matters";
import { DocumentRow } from "./DocumentRow";

export function MatterDocumentsTab({ matterId }: { matterId: string }) {
  const { t } = useTranslation("matters");
  const { data, isLoading } = useMatterDocuments(matterId);
  const { uploadDocument } = useMatterMutations();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  const handleUpload = () => {
    if (!selectedFile || uploadDocument.isPending) return;
    uploadDocument.mutate(
      { matterId, file: selectedFile },
      {
        onSuccess: () => {
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      },
    );
  };

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadDocument.isPending}
            className="shrink-0 gap-2"
          >
            <Paperclip className="h-4 w-4" />
            {selectedFile ? selectedFile.name : t("documents.chooseFile")}
          </Button>
          {!selectedFile && (
            <span className="truncate text-xs text-gray-400">
              {t("documents.noFile")}
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleUpload}
          disabled={!selectedFile || uploadDocument.isPending}
          className="gap-2 border-2 border-black rounded-lg text-gray-900 bg-yellow-300 shadow-[3px_3px_0_0_#000] hover:bg-yellow-400"
        >
          <Upload className="h-4 w-4" />
          {uploadDocument.isPending
            ? t("documents.uploading")
            : t("documents.upload")}
        </Button>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-gray-500">{t("documents.empty")}</p>
      ) : (
        <div className="divide-y divide-dashed divide-gray-200">
          {documents.map((document) => (
            <DocumentRow key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
}
