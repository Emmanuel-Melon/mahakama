import { FileText, Eye, Download } from "lucide-react";
import { Button } from "~/components/ui/button";

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

  const handleView = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(url, '_blank');
  };

  const handleDownload = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    // This is a basic implementation - you might want to enhance it
    // to handle different file types and download properly
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Related Legal Documents
      </h4>
      <div className="grid gap-3">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className="border-2 border-gray-900 bg-white"
            style={{
              borderRadius: "6px 12px 6px 12px",
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <div className="p-3">
              <p className="font-bold text-sm text-gray-900">{doc.title}</p>
              <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs font-medium text-gray-700 hover:bg-gray-100"
                  onClick={(e) => handleView(doc.url, e)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs font-medium text-gray-700 hover:bg-gray-100"
                  onClick={(e) => handleDownload(doc.url, e)}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
