import type { Route } from "./+types/$documentId";
import { DocumentDetailsScreen } from "~/feature/documents/screens/DocumentDetailsScreen";
import { useDocument } from "~/feature/documents/hooks/use-documents";
import { PageDetailsLoading } from "~/components/page-details-loading";
import { PageDetailsError } from "~/components/page-details-error";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Document - Mahakama" },
    {
      name: "description",
      content: "View document details",
    },
  ];
}

export default function DocumentDetails({ params }: Route.ComponentProps) {
  const { documentId } = params;
  const { data: document, isLoading, error } = useDocument(documentId);
  if (isLoading) return <PageDetailsLoading 
    title="Loading Document" 
    description="Please wait while we load the document details..." 
    showSkeleton={false} 
  />;
  
  if (error) return <PageDetailsError 
    error={error instanceof Error ? error : new Error(String(error))} 
    title="Error Loading Document"
    description="We couldn't load the document details. Please try again later."
  />;
  
  if (!document) return <PageDetailsError 
    error={new Error("Document not found")}
    title="Document Not Found"
    description="The requested document could not be found. It may have been moved or deleted."
  />;

  return <DocumentDetailsScreen document={document} error="" />;
}
