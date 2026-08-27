import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Upload, FileText } from "lucide-react";

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function FileDropZone({
  onFilesSelected,
  disabled = false,
}: FileDropZoneProps) {
  const { t } = useTranslation("corpus");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept = ".pdf,application/pdf";

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const pdfs = Array.from(fileList).filter(
        (f) => f.type === "application/pdf" || f.name.endsWith(".pdf"),
      );
      if (pdfs.length > 0) onFilesSelected(pdfs);
    },
    [onFilesSelected],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleClick() {
    if (!disabled) fileInputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    e.target.value = "";
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
        disabled
          ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-60"
          : isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-900 bg-white hover:bg-gray-50"
      }`}
      style={{
        borderRadius: "8px 16px 8px 16px",
        boxShadow: isDragOver ? "4px 4px 0 0 #3b82f6" : "2px 2px 0 0 #000",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-lg border-2 border-gray-900 bg-yellow-400 flex items-center justify-center">
          {isDragOver ? (
            <FileText className="h-6 w-6 text-gray-900" />
          ) : (
            <Upload className="h-6 w-6 text-gray-900" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">
            {t("dropZone.title")}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t("dropZone.description")}
          </p>
        </div>
      </div>
    </div>
  );
}
