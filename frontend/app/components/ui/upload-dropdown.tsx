import { useState, useRef, useEffect } from "react";
import { Plus, File } from "lucide-react";
import { Button } from "~/components/ui/button";

interface UploadDropdownProps {
  onFileUpload: (files: File[]) => void;
  disabled?: boolean;
}

export function UploadDropdown({
  onFileUpload,
  disabled = false,
}: UploadDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
      setIsOpen(false);
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = "";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="icon"
        disabled={disabled}
        aria-label="Upload content"
      >
        <Plus className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="sm"
            >
              <File className="w-4 h-4" />
              <span>Upload PDF</span>
            </Button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,application/pdf"
      />
    </div>
  );
}
