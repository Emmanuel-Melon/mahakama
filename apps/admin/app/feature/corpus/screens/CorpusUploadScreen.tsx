import { useTranslation } from "react-i18next";
import { useUploadCorpusEntry } from "@mah/api/src/hooks/corpus/use-corpus.sse";
import { getUploadKey } from "@mah/api/src/hooks/use-upload-manager";
import { FileDropZone } from "../components/FileDropZone";
import { UploadProgressCard } from "../components/UploadProgressCard";
import { RecentEntries } from "../components/RecentEntries";

export function CorpusUploadScreen() {
  const { t } = useTranslation("corpus");
  const { uploads, upload, clearUploads, isUploading, hasErrors } =
    useUploadCorpusEntry();

  const uploadEntries = Object.entries(uploads);
  const hasUploads = uploadEntries.length > 0;

  function handleFilesSelected(files: File[]) {
    upload(files);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-600 mt-1">{t("subtitle")}</p>
      </div>

      <FileDropZone
        onFilesSelected={handleFilesSelected}
        disabled={isUploading}
      />

      {hasUploads && (
        <fieldset className="border-2 border-gray-900 rounded-lg p-5 bg-white">
          <legend className="px-3 text-xs font-bold uppercase tracking-wider bg-yellow-400 text-gray-900 border-2 border-gray-900 rounded-md">
            {t("upload.uploading")}
          </legend>

          <div className="space-y-3 pt-2">
            {uploadEntries.map(([key, progress]) => {
              const fileName = key.split("|")[0];
              return (
                <UploadProgressCard
                  key={key}
                  fileName={fileName}
                  progress={progress}
                />
              );
            })}
          </div>

          {!isUploading && (
            <div className="mt-4">
              <button
                type="button"
                onClick={clearUploads}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                {t("actions.clear")}
              </button>
            </div>
          )}
        </fieldset>
      )}

      <RecentEntries />
    </div>
  );
}
