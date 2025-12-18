import { Share2, Bookmark, MessageCircle } from "lucide-react";

interface ResponseControlsProps {
  onNewQuestion: () => void;
  onSave: () => void;
  onShare: () => void;
}

export function ResponseControls({
  onNewQuestion,
  onSave,
  onShare,
}: ResponseControlsProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-gray-200">
      <button
        onClick={onSave}
        className="px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-900 font-bold text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
        style={{
          borderRadius: "6px 12px 6px 12px",
          boxShadow: "2px 2px 0 0 #000",
        }}
      >
        <Bookmark className="h-4 w-4" />
        Save Answer
      </button>
      <button
        onClick={onShare}
        className="px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-900 font-bold text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
        style={{
          borderRadius: "6px 12px 6px 12px",
          boxShadow: "2px 2px 0 0 #000",
        }}
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
    </div>
  );
}
