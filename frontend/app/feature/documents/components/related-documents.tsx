import { FileText } from "lucide-react";

type RelatedDocument = {
  id: string | number;
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
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Related Documents
        </h3>
        <p className="text-sm text-gray-500">
          Similar documents you might find helpful.
        </p>
      </div>
      
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border-2 border-gray-900"
            style={{
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Related Document</p>
              <p className="text-base font-semibold text-gray-900">{doc.title}</p>
              <p className="text-sm text-gray-500">{doc.type} • Updated {doc.lastUpdated}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
