import { CheckCircle } from "lucide-react";

interface DocumentHighlightsProps {
  highlights: string[];
}

export function DocumentHighlights({ highlights }: DocumentHighlightsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Key Highlights</h3>
        <p className="text-sm text-gray-500">
          Important points and key information from this document.
        </p>
      </div>

      <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border-2 border-gray-900"
            style={{
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-base font-semibold text-gray-900">
                {highlight}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
