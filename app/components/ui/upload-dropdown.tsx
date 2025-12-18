import { useState, useRef, useEffect } from "react";
import { Upload, Image, File, X } from "lucide-react";

interface UploadDropdownProps {
  onFileUpload: (files: File[]) => void;
  disabled?: boolean;
}

export function UploadDropdown({ onFileUpload, disabled = false }: UploadDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
      setIsOpen(false);
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleUploadType = (type: 'file' | 'image') => {
    if (type === 'file') {
      fileInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Upload content"
      >
        <Upload className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              type="button"
              onClick={() => handleUploadType('file')}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <File className="w-4 h-4" />
              <span>Upload File</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleUploadType('image')}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <Image className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
