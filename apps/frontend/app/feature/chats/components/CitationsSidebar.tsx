import { FileText, ExternalLink } from "lucide-react";
import type { RAGSource } from "@mah/api/clients/chat.api";

interface CitationsSidebarProps {
  sources: RAGSource[];
  focusedCitation?: number | null;
}

export function CitationsSidebar({
  sources,
  focusedCitation,
}: CitationsSidebarProps) {
  return (
    <aside className="w-80 flex-shrink-0 hidden lg:flex flex-col h-full bg-background border-l overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-foreground" />
          <h2 className="font-semibold text-sm text-foreground">
            Source Citations
          </h2>
        </div>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
          {sources.length}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {sources.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            <p>No citations available for the current context yet.</p>
          </div>
        ) : (
          sources.map((source, index) => {
            const isFocused = focusedCitation === index;
            return (
              <div
                key={source.id ?? index}
                id={`citation-${index + 1}`}
                className={`p-3 rounded-lg border bg-card text-card-foreground shadow-sm space-y-1.5 text-xs transition-all duration-200 ${
                  isFocused
                    ? "ring-2 ring-blue-400 bg-blue-50 border-blue-200"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-[10px]">
                      {index + 1}
                    </span>
                    {source.title || "Legal Reference"}
                  </span>
                </div>
                {source.content ? (
                  <p className="text-muted-foreground line-clamp-4 italic">
                    &ldquo;{source.content}&rdquo;
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    {source.fullCitation ?? "No detailed extract available."}
                  </p>
                )}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline block pt-1 font-medium"
                  >
                    View Source Link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
