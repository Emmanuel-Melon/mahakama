import { CardWithLabel } from "~/components/ui/card-with-label";

interface DocumentMetadataProps {
  type: string;
  sections: number;
  lastUpdated: string;
  createdAt: string;
}

export function DocumentMetadata({
  type,
  sections,
  lastUpdated,
  createdAt,
}: DocumentMetadataProps) {
  return (
    <CardWithLabel
      label="DOCUMENT DETAILS"
      className="bg-white p-6"
      labelClassName="text-xs font-medium tracking-wider text-gray-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Type</div>
          <div className="text-gray-900">{type}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Sections</div>
          <div className="text-gray-900">{sections}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Last Updated</div>
          <div className="text-gray-900">{lastUpdated}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Created</div>
          <div className="text-gray-900">
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </CardWithLabel>
  );
}
