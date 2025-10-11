import { DocumentCard, type Document } from "./document-card";
import { ListControls } from "../list-controls";

interface DocumentCollectionProps {
  documents: Document[];
  displayMode?: 'list' | 'grid';
  variant?: 'default' | 'minimal';
}

export function DocumentCollection({ 
  documents, 
  displayMode = 'list',
  variant = 'default' 
}: DocumentCollectionProps) {
  return (
    <div className="space-y-6">
      <ListControls 
        totalItems={documents.length} 
        label="Legal Documents" 
        displayMode={displayMode}
        onDisplayModeChange={(mode) => {
          // This will be connected to the ListControls component in the next step
          console.log('Display mode changed to:', mode);
        }}
      />
      
      {displayMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              displayMode="grid"
              variant={variant}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              displayMode="list"
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
