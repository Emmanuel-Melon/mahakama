import { Link } from "react-router";
import { Download, Eye, FileText } from "lucide-react";
import { IconContainer } from "~/components/icon-container";
import { BookmarkButton } from "~/components/bookmark-button";
import { ShareButton } from "~/components/share-button";
import { MahButton, type MahAction } from "~/components/mah-button";
import { MahCard } from "~/components/mah-card";
import { type Document } from "@mah/api/clients/documents.api";

interface CorpusCardProps {
  document: Document;
  /** Controls the visual style of the card */
  variant?: "default" | "minimal";
  /** Controls the layout mode - grid (card) or list */
  displayMode?: "grid" | "list";
  onView?: (url: string) => void;
  onDownload?: (url: string) => void;
  onBookmark?: (document: Document) => void;
  className?: string;
}

export function CorpusCard({
  document,
  variant = "default",
  displayMode = "list",
  onView,
  onDownload,
  onBookmark,
  className = "",
}: CorpusCardProps) {
  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onView && document.storageUrl) {
      onView(document.storageUrl);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDownload && document.storageUrl) {
      onDownload(document.storageUrl);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBookmark) {
      onBookmark(document);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Sharing document:", document.title);
  };

  const defaultActions = (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2h-10a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {document.lastUpdated}
          </span>
          <span className="h-1 w-1 rounded-full bg-gray-400"></span>
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {document.sections} Sections
          </span>
        </div>

        <Link to={`/documents/${document.id}`}>
          <MahButton variant="primary">View full document</MahButton>
        </Link>
      </div>
    </div>
  );

  const minimalActions = (
    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
      <MahButton onClick={handleView} variant="secondary">
        <Eye className="h-3.5 w-3.5 mr-1.5" />
        View
      </MahButton>
      <div className="flex items-center space-x-2">
        <BookmarkButton
          onClick={handleBookmark}
          isBookmarked={
            document.bookmarkCount !== undefined && document.bookmarkCount > 0
          }
          bookmarkCount={document.bookmarkCount}
          size="sm"
        />
        <div className="h-4 w-px bg-gray-300 mx-1"></div>
        <MahButton onClick={handleDownload} variant="secondary">
          <Download className="h-4 w-4" />
          {document.downloadCount !== undefined && (
            <span className="text-xs ml-1 text-gray-500">
              {document.downloadCount}
            </span>
          )}
        </MahButton>
      </div>
    </div>
  );

  // Grid layout (card)
  if (displayMode === "grid") {
    return variant === "minimal" ? (
      // Minimal grid card
      <MahCard variant="default" className="group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex justify-start">
            <IconContainer
              icon={FileText}
              size="lg"
              color="outline"
              className="flex-shrink-0"
            />
          </div>
          <ShareButton
            onClick={handleShare}
            className="p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000]"
            aria-label="Share document"
          />
        </div>
        <div className="text-left mb-4">
          <h3 className="font-black text-gray-900 text-base mt-1 font-serif">
            {document.title}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
          {document.description}
        </p>
        <div className="mt-auto pt-4">
          <div className="flex gap-2">
            <MahButton
              href={`/documents/${document.id}`}
              variant="card"
              className="flex-[2]"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Document
            </MahButton>
            <BookmarkButton
              onClick={handleBookmark}
              isBookmarked={
                document.bookmarkCount !== undefined &&
                document.bookmarkCount > 0
              }
              bookmarkCount={document.bookmarkCount}
              size="sm"
              className="p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000] flex-[1] h-full"
            />
          </div>
        </div>
      </MahCard>
    ) : (
      // Default grid card
      <MahCard variant="default" className="group">
        <div className="flex justify-between items-start mb-4">
          <div className="flex justify-start">
            <IconContainer
              icon={FileText}
              size="lg"
              color="outline"
              className="flex-shrink-0"
            />
          </div>
          <ShareButton
            onClick={handleShare}
            className="p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000]"
            aria-label="Share document"
          />
        </div>
        <div className="text-left mb-4">
          <h3 className="font-black text-gray-900 text-base mt-1 font-serif">
            {document.title}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
          {document.description}
        </p>
        <div className="mt-auto pt-4">
          <div className="flex gap-2">
            <MahButton
              href={`/documents/${document.id}`}
              variant="card"
              className="flex-[2]"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Document
            </MahButton>
            <BookmarkButton
              onClick={handleBookmark}
              isBookmarked={
                document.bookmarkCount !== undefined &&
                document.bookmarkCount > 0
              }
              bookmarkCount={document.bookmarkCount}
              size="sm"
              className="p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000] flex-[1] h-full"
            />
          </div>
        </div>
      </MahCard>
    );
  }

  // List layout
  if (displayMode === "list") {
    return variant === "minimal" ? (
      // Minimal list item
      <MahCard variant="minimal" className={className}>
        <div className="flex items-start">
          <div className="mr-3 flex-shrink-0">
            <IconContainer
              icon={FileText}
              size="md"
              color="outline"
              className="mt-0.5"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 text-sm mb-1">
                {document.title}
              </h3>
              <span className="text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-2 py-0.5 ml-2 whitespace-nowrap flex-shrink-0 bg-white">
                {document.type}
              </span>
            </div>
            {minimalActions}
          </div>
        </div>
      </MahCard>
    ) : (
      // Default list item (enhanced)
      <MahCard
        variant="outlined"
        className={`group transition-all duration-200 hover:-translate-y-1 ${className}`}
      >
        <div className="flex items-start">
          <div className="mr-5">
            <IconContainer
              icon={FileText}
              size="lg"
              color="outline"
              className="bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 transition-colors"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 mb-2 pr-4">
                {document.title}
              </h2>
              <span className="px-3 py-1 text-gray-700 text-xs font-medium border border-gray-300 rounded-full whitespace-nowrap flex-shrink-0 bg-white">
                {document.type}
              </span>
            </div>
            <p className="text-gray-600 line-clamp-2 mb-4">
              {document.description}
            </p>
            {defaultActions}
          </div>
        </div>
      </MahCard>
    );
  }

  // Default to grid view if displayMode is not recognized
  return (
    <MahCard variant="minimal" className={className}>
      <div className="p-4 flex-1">
        <div className="flex items-start mb-3">
          <IconContainer
            icon={FileText}
            size="lg"
            color="outline"
            className="flex-shrink-0"
          />
          <div className="ml-3">
            <span className="text-xs font-medium text-gray-500">
              {document.type}
            </span>
            <h3 className="font-medium text-gray-900 text-sm mt-0.5">
              {document.title}
            </h3>
          </div>
        </div>
        <p className="text-xs text-gray-500 line-clamp-3 mb-4">
          {document.description}
        </p>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{document.lastUpdated}</span>
          <span>{document.sections} Sections</span>
        </div>
      </div>
    </MahCard>
  );
}
