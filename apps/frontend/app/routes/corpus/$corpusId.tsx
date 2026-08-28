import type { Route } from "./+types/$corpusId";
import { CorpusDetailsScreen } from "~/feature/corpus/screens/CorpusDetailsScreen";
import { useCorpusEntry } from "@mah/api/src/hooks/corpus/use-corpus";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

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
