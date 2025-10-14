import { Link } from "react-router";
import { Bookmark, Download, Eye, FileText } from "lucide-react";
import { IconContainer } from "~/components/icon-container";

export interface Document {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: number;
  type: string;
  storageUrl?: string;
  bookmarkCount?: number;
  downloadCount?: number;
}

interface DocumentCardProps {
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

export function DocumentCard({
  document,
  variant = "default",
  displayMode = "list",
  onView,
  onDownload,
  onBookmark,
  className = "",
}: DocumentCardProps) {
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {document.sections} Sections
          </span>
        </div>

        <Link
          to={`/document/${document.id}`}
          className="group inline-flex items-center font-medium text-gray-900 hover:text-yellow-600 transition-colors text-sm"
        >
          View full document
          <svg
            className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );

  const minimalActions = (
    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
      <button
        onClick={handleView}
        className="flex items-center text-xs font-medium text-gray-700 hover:text-yellow-600 transition-colors"
        title="View document"
      >
        <Eye className="h-3.5 w-3.5 mr-1.5" />
        View
      </button>
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <button
            onClick={handleBookmark}
            className="p-1.5 text-gray-500 hover:text-yellow-600 transition-colors flex items-center"
            aria-label="Bookmark document"
            title="Bookmark"
          >
            <Bookmark className="h-4 w-4" />
            {document.bookmarkCount !== undefined && (
              <span className="text-xs ml-1 text-gray-500">
                {document.bookmarkCount}
              </span>
            )}
          </button>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-500 hover:text-yellow-600 transition-colors flex items-center"
            aria-label="Download document"
            title="Download"
          >
            <Download className="h-4 w-4" />
            {document.downloadCount !== undefined && (
              <span className="text-xs ml-1 text-gray-500">
                {document.downloadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Grid layout (card)
  if (displayMode === "grid") {
    return variant === "minimal" ? (
      // Minimal grid card
      <div
        className={`flex flex-col h-full border border-gray-200 bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow ${className}`}
      >
        <div className="p-4 flex-1">
          <div className="flex items-start">
            <IconContainer
              icon={FileText}
              size="md"
              color="outline"
              className="flex-shrink-0 mt-0.5"
            />
            <div className="ml-3 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate">
                {document.title}
              </h3>
              <span className="text-xs text-gray-500">{document.type}</span>
            </div>
          </div>
          {minimalActions}
        </div>
      </div>
    ) : (
      // Default grid card
      <div
        className={`flex flex-col h-full border-2 border-gray-900 bg-white rounded-lg overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${className}`}
      >
        <div className="p-5 flex-1">
          <div className="flex items-start mb-4">
            <IconContainer
              icon={FileText}
              size="lg"
              color="outline"
              className="flex-shrink-0 bg-yellow-50 text-yellow-600"
            />
            <div className="ml-3">
              <span className="text-xs font-medium text-gray-500">
                {document.type}
              </span>
              <h3 className="font-semibold text-gray-900 text-base mt-1">
                {document.title}
              </h3>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {document.description}
          </p>
          {defaultActions}
        </div>
      </div>
    );
  }

  // List layout
  if (displayMode === "list") {
    return variant === "minimal" ? (
      // Minimal list item
      <div
        className={`border border-gray-200 bg-white rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}
      >
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
              <span className="text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-2 py-0.5 ml-2 whitespace-nowrap flex-shrink-0">
                {document.type}
              </span>
            </div>
            {minimalActions}
          </div>
        </div>
      </div>
    ) : (
      // Default list item (enhanced)
      <div
        className={`group relative bg-white border-2 border-gray-900 rounded-lg p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}
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
      </div>
    );
  }

  // Default to grid view if displayMode is not recognized
  return (
    <div
      className={`flex flex-col h-full border border-gray-200 bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow ${className}`}
    >
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
    </div>
  );
}
