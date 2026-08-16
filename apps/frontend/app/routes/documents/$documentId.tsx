import type { Route } from "./+types/$documentId";
import { DocumentDetailsScreen } from "~/feature/documents/screens/DocumentDetailsScreen";
import { useDocument } from "@mah/api/hooks/use-documents";
import { PageDetailsLoading } from "~/components/page-details-loading";
import { PageDetailsError } from "~/components/page-details-error";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

export function meta({}: Route.MetaArgs) {
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
  return <DocumentDetailsScreen document={document} error="" />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
