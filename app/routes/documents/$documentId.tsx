import type { Route } from "./+types/$documentId";
import { DocumentDetailsScreen } from "~/feature/documents/screens/DocumentDetailsScreen";
import { useDocument } from "~/feature/documents/hooks/use-documents";
import { LoadingState } from "~/components/async-state/loading";
import { ErrorState } from "~/components/async-state/error";

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

  console.log("god", documentId)

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error instanceof Error ? error : new Error(String(error))} />;
  if (!document) return <ErrorState error={new Error("Document not found")} />;

  return <DocumentDetailsScreen document={document} error="" />;
}
