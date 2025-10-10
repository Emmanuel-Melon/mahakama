import { DocumentCard, type Document } from "./document-card";
import { ListControls } from "../lawyers/list-controls";

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="space-y-6">
      <ListControls totalItems={documents.length} />
      <div className="space-y-6">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
}
