import { FileText, Download, Share2, Bookmark, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { BorderedBox } from "~/components/ui/bordered-box";
import type { DocumentDetails } from "~/routes/+types/document.details";
import { IconContainer } from "../icon-container";

interface DocumentDetailsHeaderProps {
  document: DocumentDetails;
}

export function DocumentDetailsHeader({
  document,
}: DocumentDetailsHeaderProps) {
  return (
    <BorderedBox
      className="p-8 mb-8"
      variant="decorated"
      label={document.type}
      labelClassName="bg-yellow-100 text-yellow-800 font-bold"
      borderRadius="rounded-tl-2xl rounded-br-2xl"
      gradientFrom="from-white"
      gradientTo="to-gray-50"
    >
      <IconContainer
        icon={FileText}
        size="lg"
        color="handdrawn"
        className="mb-4"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-black text-gray-900 mb-3">
          {document.title}
        </h1>
        <p className="text-gray-600 text-lg">{document.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Last updated: {document.lastUpdated}
        </span>
        <span className="h-1 w-1 rounded-full bg-gray-400"></span>
        <span className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {document.sections} Sections
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <a
          href={document.storageUrl}
          download
          className="inline-flex items-center justify-center px-4 py-2 border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm"
          style={{
            boxShadow: "2px 2px 0 0 #000",
            borderRadius: "4px 8px 4px 8px",
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </a>
        <Button
          variant="outline"
          className="border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold"
          style={{
            boxShadow: "2px 2px 0 0 #000",
            borderRadius: "4px 8px 4px 8px",
          }}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          className="border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold"
          style={{
            boxShadow: "2px 2px 0 0 #000",
            borderRadius: "4px 8px 4px 8px",
          }}
        >
          <Bookmark className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </BorderedBox>
  );
}
