import { CheckCircle } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";
import { StylizedList } from "~/components/ui/stylized-list";
import { SketchySeparator } from "../components/sketchy-separator";

interface DocumentHighlightsProps {
  highlights: string[];
  documents: any[];
}

export function DocumentHighlights({
  highlights,
  documents,
}: DocumentHighlightsProps) {
  return (
    <CardWithLabel
      label="Key Highlights"
      labelClassName="bg-yellow-100 text-yellow-800 font-bold"
      className="h-full space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Document Highlights
          </h3>
          <p className="text-sm text-gray-500">
            Key points and important information from this document.
          </p>
        </div>
        <SketchySeparator />
        <StylizedList
          items={highlights.map((text) => ({
            text,
            icon: CheckCircle,
            className: "text-gray-700 py-1.5",
            iconClassName: "text-green-500",
          }))}
          className="space-y-2"
        />
      </div>
    </CardWithLabel>
  );
}
