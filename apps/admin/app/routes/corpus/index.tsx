import type { Route } from "./+types/index";
import { CorpusUploadScreen } from "~/feature/corpus/screens/CorpusUploadScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Corpus Upload - Mahakama Admin" },
    {
      name: "description",
      content: "Upload PDF documents to the legal corpus.",
    },
  ];
}

export default function CorpusRoute() {
  return <CorpusUploadScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
