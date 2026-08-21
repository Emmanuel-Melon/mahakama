import type { Route } from "./+types/$corpusId";
import { CorpusDetailsScreen } from "~/feature/corpus/screens/CorpusDetailsScreen";
import { useCorpusEntry } from "@mah/api/hooks/corpus/use-corpus";
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
  const { corpusId } = params;
  const { data: document, isLoading, error } = useCorpusEntry(corpusId);
  return (
    <CorpusDetailsScreen
      document={document}
      error={null}
      isLoading={isLoading}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
