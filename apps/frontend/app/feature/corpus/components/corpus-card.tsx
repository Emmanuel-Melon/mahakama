import { Link } from "react-router";
import { Download, Eye, FileText } from "lucide-react";
import { IconContainer } from "~/components/atoms/icon-container";
import { BookmarkButton } from "@mah/ui";
import { ShareButton } from "~/components/molecules/share-button";
import { MahButton } from "~/components/molecules/mah-button";
import { MahCard } from "~/components/atoms/mah-card";
import { type Corpus } from "@mah/api/src/clients/corpus.api";

interface CorpusCardProps {
  document: Corpus;
  /** Controls the visual style of the card */
  variant?: "default" | "minimal";
  /** Controls the layout mode - grid (card) or list */
  displayMode?: "grid" | "list";
  onView?: (url: string) => void;
  onDownload?: (url: string) => void;
  onBookmark?: (document: Corpus) => void;
  className?: string;
}

export const CorpusCard = ({
  document,
  variant = "default",
  displayMode = "grid",
  onView,
  onDownload,
  onBookmark,
  className = "",
}: CorpusCardProps) => {
  const isMinimal = variant === "minimal";
  const isList = displayMode === "list";

  return (
    <MahCard
      className={`relative flex ${
        isList ? "flex-row items-center justify-between p-4" : "flex-col p-5"
      } ${className}`}
    >
      <div className={`flex items-start gap-4 ${isList ? "flex-1" : "w-full"}`}>
        <IconContainer icon={FileText} className="shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 bg-muted rounded-md">
              {document.type}
            </span>
            {document.jurisdiction && (
              <span className="text-xs text-muted-foreground">
                {document.jurisdiction}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base truncate mb-1">
            {document.title}
          </h3>
          {!isMinimal && document.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {document.description}
            </p>
          )}
          {!isMinimal && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {document.actName && <span>Act: {document.actName}</span>}
              <span>Sections: {document.sections}</span>
              <span>Downloads: {document.downloadCount}</span>
              <span>
                Updated: {new Date(document.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex items-center gap-2 shrink-0 ${
          isList ? "ml-4" : "mt-4 pt-4 border-t justify-between w-full"
        }`}
      >
        <div className="flex items-center gap-1">
          {onBookmark && (
            <BookmarkButton
              onClick={() => onBookmark(document)}
              aria-label="Bookmark document"
            />
          )}
          <ShareButton shareCount={0} onClick={() => {}} />
        </div>
        <div className="flex items-center gap-2">
          {onView && (
            <MahButton
              variant="secondary"
              onClick={() => onView(document.storageUrl)}
            >
              <Eye className="w-4 h-4 mr-1.5" />
              View
            </MahButton>
          )}
          {onDownload && (
            <MahButton
              variant="secondary"
              onClick={() => onDownload(document.storageUrl)}
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download
            </MahButton>
          )}
        </div>
      </div>
    </MahCard>
  );
};
