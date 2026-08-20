import type { Route } from "./+types/$documentId";
import { CorpusDetailsScreen } from "~/feature/corpus/screens/CorpusDetailsScreen";
import { useDocument } from "@mah/api/hooks/use-documents";
import { PageDetailsLoading } from "~/components/molecules/page-details-loading";
import { PageDetailsError } from "~/components/molecules/page-details-error";
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
  return     <CorpusDetailsScreen document={document} error="" />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
