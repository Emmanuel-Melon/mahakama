import { DocumentCard } from "~/legal-database/document-card";
import { BorderedBox } from "~/components/ui/bordered-box";

type RelatedDocument = {
  id: string;
  title: string;
  type: string;
  lastUpdated: string;
  sections?: number;
  description?: string;
  storageUrl?: string;
};

interface RelatedDocumentsProps {
  documents: RelatedDocument[];
}

export function RelatedDocuments({ documents }: RelatedDocumentsProps) {
  if (documents.length === 0) return null;

  return (
    <BorderedBox
      label="Related Documents"
      labelClassName="bg-blue-100 text-blue-800 font-bold"
      className="mt-8"
    >
      <div className="space-y-4">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={{
              ...doc,
              description: doc.description || "",
              sections: doc.sections || 0,
              lastUpdated: doc.lastUpdated,
              type: doc.type,
              id: doc.id,
              title: doc.title,
            }}
            variant="minimal"
            displayMode="grid"
            className="border-0 border-b border-gray-200 last:border-b-0 rounded-none px-0 py-3 first:pt-0 last:pb-0"
          />
        ))}
      </div>
    </BorderedBox>
  );
}
