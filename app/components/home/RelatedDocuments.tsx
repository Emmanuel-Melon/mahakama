import { FileText } from "lucide-react";

interface DocumentItem {
  id: number;
  title: string;
  description: string;
  url: string;
}

interface RelatedDocumentsProps {
  documents: DocumentItem[];
}

export function RelatedDocuments({ documents = [] }: RelatedDocumentsProps) {
  if (documents.length === 0) return null;

  return (
    <div>
      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Related Legal Documents
      </h4>
      <div className="grid gap-3">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
            className="block p-3 border-2 border-gray-900 bg-white hover:bg-yellow-50 transition-colors"
            style={{
              borderRadius: "6px 12px 6px 12px",
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <p className="font-bold text-sm text-gray-900">{doc.title}</p>
            <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
