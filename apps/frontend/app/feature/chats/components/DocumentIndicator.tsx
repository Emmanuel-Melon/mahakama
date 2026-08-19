import { FileText, Trash2 } from "lucide-react";
import { useDeleteDocument } from "@mah/api/hooks/documents/use-documents";
import { Button } from "~/components/ui/button";

interface DocumentIndicatorProps {
  filename?: string;
  totalChunks?: number;
  sessionId: string;
}

export function DocumentIndicator({
  filename,
  totalChunks,
  sessionId,
}: DocumentIndicatorProps) {
  const deleteMutation = useDeleteDocument();

  const handleDelete = () => {
    if (confirm("Remove the uploaded document? This cannot be undone.")) {
      deleteMutation.mutate(sessionId);
    }
  };

  return (
    <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-sm text-blue-800 font-medium truncate">
            {filename || "Uploaded Document"}
          </span>
          {totalChunks && (
            <span className="text-xs text-blue-600">
              ({totalChunks} chunks)
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-blue-600 hover:text-red-600"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <p className="text-xs text-blue-600 mt-1">
        Document attached to this session. Questions will be analyzed against
        both this document and the legal corpus.
      </p>
    </div>
  );
}
