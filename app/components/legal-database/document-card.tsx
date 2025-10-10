import { Link } from "react-router";

export interface Document {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: number;
  type: string;
}

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">{document.title}</h2>
          <p className="text-muted-foreground mb-3">{document.description}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Last Updated: {document.lastUpdated}</span>
            <span>•</span>
            <span>{document.sections} Sections</span>
            <span>•</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              {document.type}
            </span>
          </div>
        </div>
        <Link 
          to={`/legal-database/${document.id}`}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
        >
          View Details
          <svg 
            className="ml-1 w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
